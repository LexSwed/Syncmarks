import { env } from "./utils"

export default function google() {
    getAccessToken()
    .then(token => {
        env.storage.sync.set({ token }, res => {
            console.log('token has been written to storage');
        })
    })
}

const REDIRECT_URL = env.identity.getRedirectURL();
const CLIENT_ID = "669959052789-qq14f9sjs08502fsra1714h3qgjfveur.apps.googleusercontent.com"
    // "669959052789-dp1u0c9fc1s3rc97eh9idmrolbercjr7.apps.googleusercontent.com";
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive.appdata"]; // 'https://www.googleapis.com/auth/drive.appfolder'
const AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
    REDIRECT_URL
)}&scope=${encodeURIComponent(SCOPES.join(" "))}`;
const VALIDATION_BASE_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo";

function extractAccessToken(redirectUri) {
    let m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1) return null;
    let params = new URLSearchParams(m[1].split("#")[0]);
    return params.get("access_token");
}

/**
Validate the token contained in redirectURL.
This follows essentially the process here:
https://developers.google.com/identity/protocols/OAuth2UserAgent#tokeninfo-validation
- make a GET request to the validation URL, including the access token
- if the response is 200, and contains an "aud" property, and that property
matches the clientID, then the response is valid
- otherwise it is not valid

Note that the Google page talks about an "audience" property, but in fact
it seems to be "aud".
*/
function validate(redirectURL) {
    const accessToken = extractAccessToken(redirectURL);
    if (!accessToken) {
        throw "Authorization failure";
    }
    const validationURL = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;
    const validationRequest = new Request(validationURL, {
        method: "GET"
    });

    function checkResponse(response) {
        return new Promise((resolve, reject) => {
            if (response.status != 200) {
                reject("Token validation error");
            }
            response.json().then(json => {
                if (json.aud && json.aud === CLIENT_ID) {
                    resolve(accessToken);
                } else {
                    reject("Token validation error");
                }
            });
        });
    }

    return fetch(validationRequest).then(checkResponse);
}

/**
Authenticate and authorize using browser.identity.launchWebAuthFlow().
If successful, this resolves with a redirectURL string that contains
an access token.
*/
function getAccessToken() {
    console.log(REDIRECT_URL);
    console.log(AUTH_URL);
    if (window.browser) {
        return env.identity
            .launchWebAuthFlow({
                interactive: true,
                url: AUTH_URL
            })
            .then(validate);
    } else {
        return new Promise((resolve, reject) => {
            env.identity.launchWebAuthFlow(
                {
                    interactive: true,
                    url: AUTH_URL
                },
                redirectURL => resolve(validate(redirectURL))
            );
        }).catch(error => {
            console.log(error);
        });
    }
}
