import type { Context } from "@netlify/functions";

export default async (request: Request, context: Context) => {
	try {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");

		const payload = {
			client_id: process.env.VITE_OAUTH_APPLICATION_ID,
			client_secret: process.env.OAUTH_SECRET,
			code: code,
			grant_type: "authorization_code",
			redirect_uri: `${process.env.VITE_THIS_SITE_URL}/oauth-redirect`,
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
			"https://www.inaturalist.org/v2/oauth/token",
			postOptions,
		);
		if (!response.ok)
			return new Response(
				`Unhandled response status: ${response.status} body: ${response.json()}`,
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
		return new Response((error as Error).toString(), {
			status: 500,
		});
	}
};
