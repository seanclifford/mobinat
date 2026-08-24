import { Box, Center } from "@mantine/core";
import React from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
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
		<ErrorBoundary
			fallbackRender={({ error }) => (
				<Center>
					<p>Something went wrong:</p>
					<pre>{getErrorMessage(error)}</pre>
				</Center>
			)}
			onError={console.log}
		>
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
		</ErrorBoundary>
	);
});

export default AnnotatorSlide;
