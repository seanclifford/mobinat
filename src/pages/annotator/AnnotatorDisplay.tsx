import { Button, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SettingsIcon } from "lucide-react";
import { useRef } from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import AuthenticationModal from "../../components/authentication-modal/AuthenticationModal";
import SettingsModal from "../../components/settings/SettingsModal";
import AnnotatorGallery, { type SlidesRef } from "./AnnotatorGallery";

interface AnnotatorDisplayProps {
	pageQueryString: string;
	setPageQueryString: (queryString: string) => void;
}

export default function AnnotatorDisplay({
	pageQueryString,
	setPageQueryString,
}: AnnotatorDisplayProps) {
	const slidesRef = useRef<SlidesRef>(null);

	const [settingsOpened, { open: openSettings, close: closeSettings }] =
		useDisclosure(false);

	const [
		authenticationOpened,
		{ open: openAuthentication, close: closeAuthentication },
	] = useDisclosure(false);

	const runQuery = (queryString: string) => {
		setPageQueryString(queryString);
		slidesRef.current?.resetToBeginning();
		closeSettings();
	};

	return (
		<>
			<SettingsModal
				opened={settingsOpened}
				close={closeSettings}
				pageQueryString={pageQueryString}
				runQuery={runQuery}
			/>
			<AuthenticationModal
				opened={authenticationOpened}
				close={closeAuthentication}
			/>
			<SettingsIcon
				fill="white"
				size={34}
				onClick={openSettings}
				strokeWidth={1.1}
				style={{
					position: "fixed",
					right: "12px",
					top: "12px",
					zIndex: "100",
				}}
			/>
			<ErrorBoundary
				fallbackRender={({ error, resetErrorBoundary }) => (
					<Center>
						<p>Something went wrong:</p>
						<pre>{getErrorMessage(error)}</pre>
						<Button onClick={resetErrorBoundary}>Back to filters</Button>
					</Center>
				)}
				onError={(error, info) => {
					console.log(error, info);
				}}
				onReset={() => {
					setPageQueryString("");
				}}
			>
				<AnnotatorGallery
					ref={slidesRef}
					submittedQueryString={pageQueryString}
					openAuthentication={openAuthentication}
				/>
			</ErrorBoundary>
		</>
	);
}
