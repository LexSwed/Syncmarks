import initApp from "./background"
import google from "./authorize"

//async function should be resolved before writing to the variable?
function start() {
    return initApp().then( res => {
        window.user = res;
        // login methods [name]: function
        window.google = google;
    })
}

start()

window.logOut = start