import { jwtDecode } from "jwt-decode";
import { limit } from "./api-limiter.js";

const AUTHENTICATED_FLAG = "auth_flag";
const AUTH_API_TOKEN = "auth_api_token";
const PRE_AUTH_LOCATION = "pre_auth_location";

const OAUTH_APPLICATION_ID = import.meta.env.VITE_OAUTH_APPLICATION_ID;
const REDIRECT_URI = `${import.meta.env.VITE_THIS_SITE_URL}/oauth-redirect`;

interface INatJwt {
	user_id: number;
	exp: number;
}

export function isAuthenticated() {
	return (
		!!localStorage.getItem(AUTHENTICATED_FLAG) ||
		!!import.meta.env.VITE_AUTH_TOKEN
	);
}

export async function authenticate(currentSite: Site) {
	sessionStorage.setItem(PRE_AUTH_LOCATION, window.location.href);

	const redirectParams = new URLSearchParams([
		["client_id", OAUTH_APPLICATION_ID],
		["redirect_uri", REDIRECT_URI],
		["response_type", "code"],
	]);
	const redirect = `${currentSite.url}/oauth/authorize?${redirectParams.toString()}`;
	window.location.href = redirect;
}

export function getApiToken() {
	const apiToken = sessionStorage.getItem(AUTH_API_TOKEN);

	if (apiToken && !tokenIsExpired(apiToken)) {
		return apiToken;
	}

	return null;
}

export function getApiTokenExpiry(token: string): number {
	const payload = decodeJwt(token);
	return (payload?.exp ?? 0) * 1000; // Convert to milliseconds
}

function tokenIsExpired(token: string): boolean {
	return getApiTokenExpiry(token) < Date.now();
}

export function getUserIdFromToken(token: string): number | undefined {
	const payload = decodeJwt(token);
	return payload?.user_id;
}

function decodeJwt(token: string) {
	try {
		return jwtDecode<INatJwt>(token);
	} catch (e) {
		console.error(e);
		return null;
	}
}

export async function requestApiToken() {
	const response = await limit(() => {
		return fetch("/.netlify/functions/auth");
	});

	if (!response.ok) {
		if (response.status === 401) {
			console.log("Not authenticated. Ensuring logged out client side.");
			clearAllAuthenticationState();
		} else {
			console.error(
				`Failed during request to get the api token: ${await response.text()}`,
			);
		}
	} else {
		const body = await response.json();
		const apiToken = body.api_token;
		sessionStorage.setItem(AUTH_API_TOKEN, apiToken);
		return apiToken;
	}
}

export function performAccessTokenRequest(
	auth_code: string,
	setLoadingStatus: React.Dispatch<React.SetStateAction<LoadingStatus>>,
) {
	const loginParams = new URLSearchParams([
		["code", auth_code],
		["redirect_uri", REDIRECT_URI],
	]);
	limit(() => {
		return fetch(`/.netlify/functions/login?${loginParams.toString()}`);
	})
		.then(async (response) => {
			if (!response.ok) {
				console.error(
					`Failed during request to get the access token: ${await response.text()}`,
				);
				setLoadingStatus("error");
				return;
			}
			localStorage.setItem(AUTHENTICATED_FLAG, "1");
			setLoadingStatus("success");
		})
		.catch((error) => {
			console.error(error.message);
			setLoadingStatus("error");
		});
}

export function redirectToPreAuthLocation() {
	const preAuthLocation =
		sessionStorage.getItem(PRE_AUTH_LOCATION) ??
		import.meta.env.VITE_THIS_SITE_URL;
	sessionStorage.removeItem(PRE_AUTH_LOCATION);
	window.location.replace(preAuthLocation);
}

export function clearAllAuthenticationState() {
	localStorage.removeItem(AUTHENTICATED_FLAG);
	sessionStorage.removeItem(AUTH_API_TOKEN);
	sessionStorage.removeItem(PRE_AUTH_LOCATION);

	fetch(`/.netlify/functions/logout`)
		.then(async (response) => {
			if (!response.ok) {
				console.error(
					`Logout failed to clear cookie: ${await response.text()}`,
				);
			}
		})
		.catch((error) => console.error(error.message));
}
