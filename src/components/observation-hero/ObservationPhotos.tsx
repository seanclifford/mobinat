import { Group, Image, ScrollArea } from "@mantine/core";
import getPhotoUrl from "../../inaturalist/photo-urls";
import { photoBannerHeight } from "./dimensions";
import classes from "./ObservationPhotos.module.css";

interface ObservationPhotosProps {
	photos: Photo[];
	photoIndex: number;
	setPhotoIndex: (index: number) => void;
}

export default function ObservationPhotos({
	photos,
	photoIndex,
	setPhotoIndex,
}: ObservationPhotosProps) {
	return (
		<ScrollArea className={photos.length > 6 ? "swiper-no-swiping" : undefined}>
			{photos.length > 1 ? (
				<Group
					justify="safe center"
					h={photoBannerHeight}
					pl="0.3em"
					pr="0.3em"
					gap="0.3em"
					wrap="nowrap"
				>
					{photos.map((photo, index) => (
						<Image
							key={photo.id}
							src={getPhotoUrl(photo, "thumb")}
							w="3.5em"
							className={
								index === photoIndex ? classes.selected : classes.thumbnail
							}
							onClick={() => setPhotoIndex(index)}
						/>
					))}
				</Group>
			) : null}
		</ScrollArea>
	);
}
