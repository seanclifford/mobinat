# Auth flow and notes

Using OAuth Code Flow in order to keep the OAuth client secret actually secret (stored in netlify env vars), and keep the user's access token from being accessed by JavaScript by keeping it in an HTTP only cookie.

No storage server side keeps things secure for users too. The functions are only used as a proxy to iNat.

The JWT will still be accessible by JavaScript, but needs to be for the app to function. However it has a limited lifespan (I think it's 24 hours?)

1. User clicks button
2. Redirect to #{site}/oauth/authorize?client_id=#{app_id}&redirect_uri=#{redirect_uri}&response_type=code"
3. Response comes back to oauth_redirect with a code
4. Flick a request to the netlify Login function to auth with code
5. Login Function calls POST #{site}/oauth/token with payload including secret code, client id, etc.
6. Login Function receives a response with the authorization_code
7. Store access_token on a cookie on the function response with HttpOnly and Secure
8. Send a request to the netlify Auth function to get a JWT
9. Function calls /users/api_token with access_token to get JWT and return on response body
10. JWT stored in session storage.

- On expiry, Auth function recalled
- On first load, Auth function called to load auth state - no cookie means no JWT returned
- change to use Authorization Code Flow instead of PKCE Flow
- Keep secret in a env variable in netlify
- Both functions could result in failure. Manage those flows