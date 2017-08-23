import "./popup.css";

const env = window.browser || window.chrome;

const btns = document.getElementById("sign-in");
const userInfo = document.getElementById("user-info");
let bg; // background page is fetching each initApp call

// popup clicked
initApp()

async function initApp() {
    bg = await getBackgroundPage();
    if (bg.user) {
        console.log(bg.user);
        showUserData(bg.user);
    } else {
        console.log("log in before using this app");
        btns.addEventListener("click", logIn);
        env.storage.onChanged.addListener(onUserLoggedIn);
    }
}

function logIn(e) {
    let service = e.target.dataset.service;
    bg[service] && bg[service]();
}

function onUserLoggedIn(storage) {
    console.log("storage changed - popup");
    if (storage.user) {
        console.log(storage.user.newValue);
        showUserData(storage.user.newValue);
        env.storage.onChanged.removeListener(onUserLoggedIn);
    }
}

function showUserData(user) {
    btns.style.display = "none";
    userInfo.style.display = "flex";
    userInfo.children[0].children[0].setAttribute("src", user.picture);
    userInfo.children[0].children[1].setAttribute("href", user.link);
    userInfo.children[0].children[1].textContent = user.name;
    userInfo.children[1].addEventListener("click", logOut);
}

function logOut() {
    btns.style.display = "flex";
    userInfo.style.display = "none";
    env.storage.sync.clear(res => {
        bg.logOut().then(res => {
            initApp();
        });
    });
}

function getBackgroundPage() {
    return window.browser
        ? env.runtime.getBackgroundPage()
        : new Promise(resolve =>
              env.runtime.getBackgroundPage(window => resolve(window))
          );
}
