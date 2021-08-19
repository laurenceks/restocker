import fetchWithAuthCheck from "./fetchWithAuthCheck";

const fetchJson = (url, options, successHandler, errorHandler = null) => {

    fetchWithAuthCheck(url, options, "json").then(async (x) => {
        successHandler(x);
    }).catch((e) => {
        console.error(e.error);
        if (e.text) {
            console.error("The following text was returned by the server which caused the above error" + e.text);
        }
        if (errorHandler) {
            errorHandler(e);
        }
    });
}

export default fetchJson;