import { Chip, Loader } from "@mantine/core";
import { useState } from "react";

interface SelectableChipProps {
	disabled: boolean;
	observation: Observation;
	controlledTerm: ControlledTerm;
	controlledValue: ControlledTermValue;
	yourAnnotations: Annotation[];
	annotationFunctions?: AnnotationFunctions;
}

export default function SelectableChip({
	disabled,
	observation,
	controlledTerm,
	controlledValue,
	yourAnnotations,
	annotationFunctions,
}: SelectableChipProps) {
	const [processing, setProcessing] = useState(false);

	const { saveAnnotation, deleteAnnotation } = annotationFunctions ?? {};

	const checked = yourAnnotations.some(
		(annotation) => annotation?.controlled_value_id === controlledValue.id,
	);

	const checkChanged = () => {
		if (!checked && saveAnnotation) {
			setProcessing(true);
			saveAnnotation({
				observation: observation,
				controlledTermId: controlledTerm.id,
				controlledValueId: controlledValue.id,
			})
				?.finally(() => setProcessing(false))
				.catch(console.error); //handle error through global context means
		} else {
			const annotation = yourAnnotations.find(
				(a) => a.controlled_value_id === controlledValue.id,
			);
			if (annotation && deleteAnnotation) {
				setProcessing(true);
				deleteAnnotation({
					observation: observation,
					annotationId: annotation.uuid,
				})
					.finally(() => setProcessing(false))
					.catch(console.error); // handle error through global context means
			}
		}
	};

	return (
		<Chip
			value={controlledValue.id}
			checked={checked || (processing && disabled)}
			disabled={disabled}
			icon={processing ? <Loader size="12" /> : undefined}
			onChange={checkChanged}
		>
			{controlledValue.label}
		</Chip>
	);
}
