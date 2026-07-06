# MobiNat Authentication flow and notes

MobiNat uses the [authorization code flow](https://www.inaturalist.org/pages/api+reference#authorization_code_flow) in order to authenticate users with iNaturalist.

This has the benefit of being able to keep the long-lived access token secure from Javascript attacks in an HTTP only cookie.

The downside is that I need to involve server-side functions to facilitate this. The functions are only used as a proxy to iNat, but it's worth the extra security.

For the app to work, the comparitively short-lived JWT will still be accessible by JavaScript, but needs to be provide in order to access to perform actions (such as annotate) on the user's behalf.

## Login flow

1. User clicks Login button
2. Browser is directed to iNaturalist at `#{site}/oauth/authorize?client_id=#{app_id}&redirect_uri=#{redirect_uri}&response_type=code`
3. User accepts permission request in the browser
4. Response comes back to MobiNat to the oauth_redirect page with a code
5. Call is made to the Login server function to authenticate with the code
6. Login Function calls POST www.inaturalist.org/oauth/token with payload including secret code, client id, client secret, etc.
7. Login Function receives a response with the the access_token
8. The access_token is stored on a cookie on the function response with HttpOnly and Secure, which saves it to the browser cookie store
9. A flag that the brower has an authentication cookie is stored in local storage
10. JWT flow is called 

## JWT / Auth flow

1. After login, on session start, or when JWT expires...
2. Authenticated flag is checked in local storage before continuing
3. Call is made to the Auth server function to get a JWT. The access_token is automatically sent with the cookie.
4. Auth function calls www.inaturalist.org/users/api_token with the access_token to get a JWT and it is returned to the browser
5. JWT is stored in session storage to be used in user actions. It is removed once the session ends (browser or tab close)

## Logout flow

1. User clicks Logout (or a 401 - Unauthenticated response is recevied from the Auth function)
2. All local login data is removed (JWT and flag that we have a cookie)
3. Call is made to Logout server function
4. Cookie deletion is set up on response
5. Cookie deleted in browser