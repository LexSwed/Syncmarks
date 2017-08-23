import { makeRequest, env } from "./utils";
import { getUserInfo, fetchBookmarks } from "./api";

export default async function initApp() {
    let res;
    if (window.browser) {
        res = await env.storage.sync.get(["token", "user"]);
    } else {
        res = await new Promise((resolve, reject) => {
            env.storage.sync.get(["token", "user"], res => resolve(res));
        });
    }
    if (res.token) {
        console.log("user logged in");
        createFetchWithToken(res.token);
        console.log(res);
        fetchBookmarks(res.user.service);
        if (res.user && Date.now() - res.user.lastFetched < 84600000) {
            return res.user;
        } else return setUserInfo(res.token);
    } else {
        console.log("attaching listenter");
        env.storage.onChanged.addListener(onStorageChange);
        return null;
    }
}

function onStorageChange(storage, field) {
    console.log("storage changed!");
    if (storage.token) {
        window.user = setUserInfo(storage.token.newValue);
        console.log("removing listener");
        env.storage.onChanged.removeListener(onStorageChange);
    }
}

async function setUserInfo(token) {
    console.log("fetch function now available");
    createFetchWithToken(token);
    return await getUserInfo().then(res => {
        fetchBookmarks(res.service);
        return res;
    });
}

async function getBookmarks() {
    if (window.chrome) {
        const b = await new Promise((resolve, reject) => {
            env.bookmarks.getTree(result => resolve(result));
        });
        console.log(b);
        return b;
    } else {
        const b = env.bookmarks.getTree().log(b);
        console.log(b);
        return b;
    }
}

function createFetchWithToken(token) {
    window.fetchAuth = function(url, options) {
        return makeRequest(url, options, token);
    };
}