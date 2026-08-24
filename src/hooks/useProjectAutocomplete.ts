import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getProjectsAutocomplete } from "../inaturalist/api";

export function useProjectAutocomplete(
	search: string,
): AutocompleteResults<Project> {
	const [results, setResults] = useState<AutocompleteResults<Project>>({
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
			getProjectsAutocomplete(generateQueryString(search))
				.then((projects) => onLoadProject(projects, setResults, queryClient))
				.catch(console.error); //record error. continue
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

function onLoadProject(
	projects: Project[],
	setResults: (autocompleteResults: AutocompleteResults<Project>) => void,
	queryClient: QueryClient,
) {
	setResults({ results: projects, state: "loaded" });
	for (const project of projects)
		queryClient.setQueryData(["project", project.id.toString()], project);
}
