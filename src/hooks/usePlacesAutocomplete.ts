import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPlacesAutocomplete } from "../inaturalist/api";

export function usePlacesAutocomplete(
	search: string,
	site: Site,
): AutocompleteResults<Place> {
	const [results, setResults] = useState<AutocompleteResults<Place>>({
		results: [],
		state: "not-searched",
	});
	const queryClient = useQueryClient();

	useEffect(() => {
		if (search.length <= 2 || !site)
			setResults({
				results: [],
				state: "not-searched",
			});
		else {
			setResults({
				results: [],
				state: "loading",
			});
			getPlacesAutocomplete(generateQueryString(search, site))
				.then((places) => onLoadPlaces(places, setResults, queryClient))
				.catch(console.error); // record error. continue
		}
	}, [search, site, queryClient]);

	return results;
}

function generateQueryString(search: string, site: Site): URLSearchParams {
	const searchParams = new URLSearchParams();
	searchParams.append("q", search);
	searchParams.append("per_page", "8");
	searchParams.append("locale", site.locale ?? navigator.language);
	return searchParams;
}

function onLoadPlaces(
	places: Place[],
	setResults: (places: AutocompleteResults<Place>) => void,
	queryClient: QueryClient,
) {
	setResults({ results: places, state: "loaded" });
	for (const place of places)
		queryClient.setQueryData(["place", place.id.toString()], place);
}
