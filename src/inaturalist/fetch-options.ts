/* eslint-disable  @typescript-eslint/no-explicit-any */

const USER_AGENT = "MobiNat";

export const getFetchOptions = (useCache = true): RequestInit => {
	return {
		method: "GET",
		headers: {
			"X-Via": USER_AGENT,
		},
		cache: useCache ? "default" : "no-cache",
	};
};

export const postAuthFetchOptions = (bodyObj: unknown, authToken: string) => {
	return {
		method: "POST",
		headers: {
			"X-Via": USER_AGENT,
			"Content-Type": "application/json;charset=utf-8",
			Authorization: authToken,
		},
		body: JSON.stringify(bodyObj),
	};
};

export const getAuthFetchOptions = (
	authToken: string,
	useCache = true,
): RequestInit => {
	return {
		method: "GET",
		headers: {
			"X-Via": USER_AGENT,
			Authorization: authToken,
		},
		cache: useCache ? "default" : "no-cache",
	};
};

export const deleteAuthFetchOptions = (authToken: string) => {
	return {
		method: "DELETE",
		headers: {
			"X-Via": USER_AGENT,
			Authorization: authToken,
		},
	};
};
