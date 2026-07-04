import type { Context } from "@netlify/functions";

export default async (request: Request, context: Context) => {
	try {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const redirect_uri = url.searchParams.get("redirect_uri");

		const payload = {
			client_id: process.env.VITE_OAUTH_APPLICATION_ID,
			client_secret: process.env.OAUTH_SECRET,
			code: code,
			grant_type: "authorization_code",
			redirect_uri: redirect_uri,
		};

		const postOptions = {
			method: "POST",
			headers: {
				"X-Via": process.env.USER_AGENT ?? "MobiNat",
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(payload),
		};

		const response = await fetch(
			"https://www.inaturalist.org/oauth/token",
			postOptions,
		);
		if (!response.ok)
			return new Response(
				`Unhandled response status: ${response.status} body: ${await response.text()}`,
				{ status: 503 },
			);

		const token = await response.json();

		context.cookies.set({
			name: "iNatAccessToken",
			value: token.access_token,
			httpOnly: true,
			sameSite: "Strict",
			secure: true,
		});
		return new Response("Auth success. iNatAccessToken cookie created.");
	} catch (error) {
		const errorString = (error as Error).toString();
		console.error(errorString);
		return new Response(errorString, {
			status: 500,
		});
	}
};
