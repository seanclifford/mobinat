import { Center, Loader, Stack, Text, useMantineTheme } from "@mantine/core";
import { type Ref, useCallback, useImperativeHandle, useRef } from "react";
import { Navigation, Virtual } from "swiper/modules";
import {
	Swiper,
	type SwiperClass,
	type SwiperRef,
	SwiperSlide,
} from "swiper/react";
import AnnotatorSlide from "./AnnotatorSlide";
import { useAnnotatorObservations } from "./useAnnotatorObservations";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/virtual";
import "./swiper-custom.css";
import styles from "./AnnotatorGallery.module.css";

interface AnnotatorGalleryProps {
	ref: Ref<SlidesRef>;
	submittedQueryString: string;
	openAuthentication: () => void;
}

export interface SlidesRef {
	resetToBeginning: () => void;
}

export default function AnnotatorGallery({
	ref,
	submittedQueryString,
	openAuthentication,
}: AnnotatorGalleryProps) {
	const theme = useMantineTheme();
	const {
		annotatorObservations,
		status,
		error,
		annotationFunctions,
		loadMore,
	} = useAnnotatorObservations(submittedQueryString, openAuthentication);

	const swiperRef = useRef<SwiperRef>(null);
	const onSlideChange = useCallback(
		(swiper: SwiperClass) => {
			if (!annotatorObservations || !loadMore) return;
			if (swiper.activeIndex + 6 >= annotatorObservations.length) loadMore();
		},
		[annotatorObservations, loadMore],
	);
	useImperativeHandle(ref, () => {
		return {
			resetToBeginning: () => {
				if (!swiperRef.current?.swiper) return;
				if (swiperRef.current.swiper.activeIndex > 0)
					swiperRef.current.swiper.slideTo(0, 0, false);
			},
		};
	});

	switch (status) {
		case "pending":
			return (
				<Center h="100vh">
					<Stack align="center">
						<Text size="lg">Loading Observations</Text>
						<Loader size={40} />
					</Stack>
				</Center>
			);
		case "error":
			return (
				<Center>
					<Stack>
						<Text c={theme.colors.red[5]}>
							Error: {error?.name ?? "unknown"}
						</Text>{" "}
						<Text>{error?.message}</Text>
					</Stack>
				</Center>
			);
		case "success":
			return !annotatorObservations || annotatorObservations?.length === 0 ? (
				<Center h="100vh">
					<Stack align="center">
						<Text size="lg">No Observations</Text>
					</Stack>
				</Center>
			) : (
				<Swiper
					ref={swiperRef}
					modules={[Navigation, Virtual]}
					slidesPerView={1}
					navigation
					virtual={{ addSlidesBefore: 2, addSlidesAfter: 2 }}
					onSlideChange={onSlideChange}
					breakpoints={{
						"@1": { slidesPerView: 2 },
						"@1.5": { slidesPerView: 3 },
						"@2": { slidesPerView: 4 },
						"@2.5": { slidesPerView: 5 },
					}}
					className={styles.swiper}
				>
					{annotatorObservations?.map((annotatorObservation, index) => {
						return (
							<SwiperSlide
								key={annotatorObservation.observation.id}
								virtualIndex={index}
							>
								<Center>
									<AnnotatorSlide
										annotatorObservation={annotatorObservation}
										annotationFunctions={annotationFunctions}
									/>
								</Center>
							</SwiperSlide>
						);
					})}
				</Swiper>
			);
	}
}
