import { Box } from "@mantine/core";
import React from "react";
import { outerWidth } from "../../components/observation-hero/dimensions";
import ObservationHero from "../../components/observation-hero/ObservationHero";
import { AnnotationSelector } from "./AnnotationSelector";

interface AnnotatorSlideProps {
	annotatorObservation: AnnotatorObservation;
	annotationFunctions?: AnnotationFunctions;
}

const AnnotatorSlide = React.memo(function AnnotatorSlide({
	annotatorObservation,
	annotationFunctions,
}: AnnotatorSlideProps) {
	const { observation, controlledTerms } = annotatorObservation;

	return (
		<Box w={outerWidth} mih="100vh">
			<ObservationHero observation={observation} />
			{observation && controlledTerms && (
				<AnnotationSelector
					observationControlledTerms={controlledTerms}
					observation={observation}
					annotationFunctions={annotationFunctions}
				/>
			)}
		</Box>
	);
});

export default AnnotatorSlide;
