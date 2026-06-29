import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	authenticate,
	clearAllAuthenticationState,
	getApiToken,
	getApiTokenExpiry,
	isAuthenticated,
	requestApiToken,
} from "../inaturalist/auth";

export default function useAuthentication(): Authentication {
	const [authentication, saveAuthentication] = useState(() =>
		loadAuthenticationFromStore(),
	);
	const refreshAuthTimeoutId = useRef(undefined as NodeJS.Timeout | undefined);

	useEffect(() => {
		if (authentication.isAuthenticated) {
			const tokenExpiresIn = authentication.authToken
				? getApiTokenExpiry(authentication.authToken) - Date.now() - 60000 // Subtract 1 minute for safety
				: 0;

			if (tokenExpiresIn <= 0) {
				refreshAuthToken(authentication, saveAuthentication);
			} else {
				refreshAuthTimeoutId.current = setTimeout(
					() => refreshAuthToken(authentication, saveAuthentication),
					tokenExpiresIn,
				);
			}
		} else {
			clearTimeout(refreshAuthTimeoutId.current);
		}
		return () => {
			clearTimeout(refreshAuthTimeoutId.current);
		};
	}, [authentication]);

	const logout = useCallback(() => {
		clearAllAuthenticationState();
		saveAuthentication(unauthenticated);
	}, []);

	const result = useMemo(() => {
		return { ...authentication, logout };
	}, [authentication, logout]);

	return result;
}

function refreshAuthToken(
	authentication: Authentication,
	saveAuthentication: (auth: Authentication) => void,
) {
	requestApiToken().then((apiToken) => {
		if (apiToken) {
			saveAuthentication({
				...authentication,
				authToken: apiToken,
			});
		}
	});
}

function loadAuthenticationFromStore(): Authentication {
	if (!isAuthenticated()) {
		return { ...unauthenticated };
	}

	const authToken = import.meta.env.VITE_AUTH_TOKEN ?? getApiToken();

	return {
		isAuthenticated: true,
		authToken: authToken,
		login: authenticate,
	};
}

export const unauthenticated = {
	isAuthenticated: false,
	login: authenticate,
};
