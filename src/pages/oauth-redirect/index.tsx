import { Center } from "@mantine/core";
import { useEffect, useState } from "react";
import {
	performAccessTokenRequest,
	redirectToPreAuthLocation,
} from "../../inaturalist/auth";

function OauthRedirect() {
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("pending");

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const authCode = urlParams.get("code");

		if (!authCode) {
			alert("Authentication failed - no auth code supplied, please try again.");
			redirectToPreAuthLocation();
		} else performAccessTokenRequest(authCode, setLoadingStatus);
	}, []);

	useEffect(() => {
		if (loadingStatus === "success") {
			redirectToPreAuthLocation();
		} else if (loadingStatus === "error") {
			alert(
				"Authentication failed while requesting access token, please try again.",
			);
			redirectToPreAuthLocation();
		}
	}, [loadingStatus]);

	return (
		<main>
			<Center>
				<b>Retreiving authentication details...</b>
			</Center>
		</main>
	);
}

export default OauthRedirect;
