import type { Context } from "@netlify/functions";

export default async (_: Request, context: Context) => {
	try {
		const accessToken = context.cookies.get("iNatAccessToken");

		if (!accessToken) return new Response("No Access Token", { status: 401 });

		const getOptions = {
			method: "GET",
			headers: {
				"X-Via": process.env.USER_AGENT ?? "MobiNat",
				Authorization: `Bearer ${accessToken}`,
			},
		};
		const response = await fetch(
			"https://www.inaturalist.org/users/api_token",
			getOptions,
		);

		if (response.status === 401)
			return new Response("iNat refused access token", { status: 401 });

		if (!response.ok)
			return new Response(
				`Unhandled bad response status: ${response.status} body: ${response.body}`,
				{ status: 503 },
			);

		return new Response(response.body);
	} catch (error) {
		const errorString = (error as Error).toString();
		console.error(errorString);
		return new Response(errorString, {
			status: 500,
		});
	}
};
