import type { Context } from "@netlify/functions";

export default async (_: Request, context: Context) => {
	try {
		context.cookies.delete({
			name: "iNatAccessToken",
			path: "/.netlify/functions",
		});
		return new Response("Logout success. iNatAccessToken cookie deleted.");
	} catch (error) {
		const errorString = (error as Error).toString();
		console.error(errorString);
		return new Response(errorString, {
			status: 500,
		});
	}
};
