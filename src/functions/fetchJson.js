import fetchWithAuthCheck from "./fetchWithAuthCheck";

const fetchJson = (url, options, successHandler, errorHandler = null) => {

    fetchWithAuthCheck(url, options, "json").then(async (x) => {
        successHandler(x);
    }).catch((e) => {
        console.error(e.error || e);
        if (e.errorMessage || e.text || e.feedback || e.feedbackText || e.error) {
            console.error("The following text was returned by the server which caused the above error" + e.text || e.error);
        }
        if (errorHandler) {
            errorHandler(e);
        }
    });
}

export default fetchJson;