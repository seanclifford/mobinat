import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUsersAutocomplete } from "../inaturalist/api";

export function useUsersAutocomplete(
	search: string,
): AutocompleteResults<User> {
	const [results, setResults] = useState<AutocompleteResults<User>>({
		results: [],
		state: "not-searched",
	});
	const queryClient = useQueryClient();

	useEffect(() => {
		if (search.length <= 2)
			setResults({
				results: [],
				state: "not-searched",
			});
		else {
			setResults({
				results: [],
				state: "loading",
			});
			getUsersAutocomplete(generateQueryString(search))
				.then((users) => onLoadUser(users, setResults, queryClient))
				.catch(console.error); // record error. continue
		}
	}, [search, queryClient]);

	return results;
}

function generateQueryString(search: string): URLSearchParams {
	const searchParams = new URLSearchParams();
	searchParams.append("q", search);
	searchParams.append("per_page", "8");
	return searchParams;
}

function onLoadUser(
	users: User[],
	setResults: (autocompleteResults: AutocompleteResults<User>) => void,
	queryClient: QueryClient,
) {
	setResults({ results: users, state: "loaded" });
	for (const user of users)
		queryClient.setQueryData(["user", user.id.toString()], user);
}
