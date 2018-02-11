/**
Fetch the user's info, passing in the access token in the Authorization
HTTP request header.
*/
import { env } from "./utils";
export function getUserInfo() {
    console.log("Get user info");
    const requestURL = "https://www.googleapis.com/oauth2/v2/userinfo";
    return window
        .fetchAuth(requestURL, { method: "GET" })
        .then(res => {
            let user = {
                ...res,
                service: 'google',
                lastFetched: Date.now()
            };
            env.storage.sync.set({
                user
            });
            return user;
        })
        .catch(err => {
            console.error(err);
            // if (err === 403) this.logOut()
        });
}

export function fetchBookmarks(service) {
    const url = services[service];
    console.log(service, url);
}

const services = {
    google() {
        const url = "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder"
        return fetchAuth(url, { method: "GET" }).then(res => {
            if (res.files && res.files.length === 0) {
                console.log('create file -> upload file');
            } else {
                console.log('get file');
            }
        });
    }
};

async function uploadBookmarks(bookmarks) {
    const url = "https://www.googleapis.com/upload/drive/v3/files";
    const headers = new Headers();
    const body = JSON.stringify(bookmarks);
    headers.append("Content-Type", "application/json");
    headers.append("Content-Length", body.length);
    const options = {
        headers,
        method: "POST",
        uploadType: "media"
    };
    return fetchAuth(url, options).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw response;
        }
    });
}
