import { Route, Router } from "wouter";
import { AuthContext, CurrentUserContext, SiteContext } from "./Contexts";
import useAuthentication from "./hooks/useAuthentication";
import { useCurrentUser } from "./hooks/useCurrentUser";
import useSite from "./hooks/useSite";
import Annotator from "./pages/annotator";
import Home from "./pages/home";
import OauthRedirect from "./pages/oauth-redirect";

function AppContent() {
	const [site, setSite] = useSite();
	const authentication = useAuthentication();
	const currentUser = useCurrentUser(authentication);
	return (
		<SiteContext value={[site, setSite]}>
			<AuthContext value={authentication}>
				<CurrentUserContext value={currentUser}>
					<Router base={import.meta.env.VITE_BASE_PATH}>
						<Route path="/">
							<Home />
						</Route>
						<Route path="/annotator">
							<Annotator />
						</Route>
						<Route path="/oauth-redirect">
							<OauthRedirect />
						</Route>
					</Router>
				</CurrentUserContext>
			</AuthContext>
		</SiteContext>
	);
}

export default AppContent;
