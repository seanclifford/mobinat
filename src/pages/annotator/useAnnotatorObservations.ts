import { useMutation } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { AuthContext, CurrentUserContext } from "../../Contexts";
import { AuthenticationError } from "../../errors/AuthenticationError";
import { useControlledTerms } from "../../hooks/useControlledTerms";
import { useObservations } from "../../hooks/useObservations";
import { addAnnotation, deleteAnnotation } from "../../inaturalist/api";

interface AnnotatorObservationResult {
	annotatorObservations?: AnnotatorObservation[];
	status: LoadingStatus;
	error?: Error;
	annotationFunctions?: AnnotationFunctions;
	loadMore?: () => void;
}

export function useAnnotatorObservations(
	submitedQueryString: string,
	requestAuthentication: () => void,
): AnnotatorObservationResult {
	const authentication = useContext(AuthContext);
	const currentUser = useContext(CurrentUserContext);

	const {
		status: observationStatus,
		data: observations,
		error: observationError,
		loadMore,
		replaceObservation,
	} = useObservations(submitedQueryString);
	const {
		status: controlledTermStatus,
		error: controlledTermsError,
		data: controlledTerms,
	} = useControlledTerms();

	const { mutateAsync: addAnnotationMutation } = useMutation({
		async mutationFn(params: SaveAnnotationParams) {
			if (!currentUser) throw new AuthenticationError("No user currently");
			const annotation = await addAnnotation(
				{
					controlled_attribute_id: params.controlledTermId,
					controlled_value_id: params.controlledValueId,
					resource_id: params.observation.uuid,
					resource_type: "Observation",
				},
				authentication,
			);
			const observationCopy = { ...params.observation };
			observationCopy.annotations.push({
				...annotation,
				vote_score: 0,
				user: currentUser,
			});
			return observationCopy;
		},
		onError(error) {
			if (error instanceof AuthenticationError) requestAuthentication();
			else console.error(error); // handle error through global means
		},
		onSuccess(observation: Observation) {
			replaceObservation?.(observation);
		},
	});

	const { mutateAsync: deleteAnnotationMutation } = useMutation({
		async mutationFn({ observation, annotationId }: DeleteAnnotationParams) {
			await deleteAnnotation(annotationId, authentication);
			const observationCopy = { ...observation };
			observationCopy.annotations = observationCopy.annotations.filter(
				(a) => a.uuid !== annotationId,
			);
			return observationCopy;
		},
		onError(error) {
			if (error instanceof AuthenticationError) requestAuthentication();
			else console.error(error); //handle error through global means
		},
		onSuccess: (observation) => {
			replaceObservation?.(observation);
		},
	});

	const annotationFunctions = useMemo(() => {
		return {
			saveAnnotation: addAnnotationMutation,
			deleteAnnotation: deleteAnnotationMutation,
		};
	}, [addAnnotationMutation, deleteAnnotationMutation]);

	const annotatorObservations = useMemo(
		() =>
			observations && controlledTerms
				? observations
						.map((observation) => {
							return {
								observation: {
									...observation,
									annotations: observation.annotations ?? [],
								},
								controlledTerms: getTaxonControlledTerms(
									observation.taxon,
									controlledTerms,
								),
							} as AnnotatorObservation;
						})
						.filter(
							(annotatorObservation) =>
								annotatorObservation.controlledTerms.length > 0,
						)
				: undefined,
		[observations, controlledTerms],
	);

	if (observationStatus === "pending" || controlledTermStatus === "pending")
		return { status: "pending" };
	if (observationStatus === "error")
		return { status: "error", error: observationError ?? undefined };
	if (controlledTermStatus === "error")
		return { status: "error", error: controlledTermsError };

	return {
		annotatorObservations,
		status: "success",
		annotationFunctions,
		loadMore,
	};
}

function getTaxonControlledTerms(
	taxon: Taxon,
	controlledTerms: ControlledTerm[],
): ControlledTerm[] {
	const taxonControlledTerms: ControlledTerm[] = [];
	if (!taxon) return taxonControlledTerms;

	for (const controlledTerm of controlledTerms) {
		if (!controlledTermAppliesToTaxon(taxon, controlledTerm)) continue;
		const controlledTermValues: ControlledTermValue[] = [];
		for (const controlledTermValue of controlledTerm.values) {
			if (controlledTermAppliesToTaxon(taxon, controlledTermValue))
				controlledTermValues.push(controlledTermValue);
		}
		if (controlledTermValues.length > 0)
			taxonControlledTerms.push({
				...controlledTerm,
				values: controlledTermValues,
			});
	}

	return taxonControlledTerms;
}

function controlledTermAppliesToTaxon(
	taxon: Taxon,
	controlledTerm: ControlledTermBase,
) {
	const included =
		!controlledTerm.taxon_ids ||
		controlledTerm.taxon_ids.some((x) => taxon?.ancestor_ids?.includes(x));
	if (!included) {
		return false;
	}
	const excepted = controlledTerm.excepted_taxon_ids?.some((x) =>
		taxon?.ancestor_ids?.includes(x),
	);
	return !excepted;
}
