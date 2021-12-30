import fetchWithAuthCheck from "./fetchWithAuthCheck";

const fetchJson = (url, options, successHandler, errorHandler = null) => {

    fetchWithAuthCheck(url, options, "json").then(async (x) => {
        successHandler(x);
    }).catch((e) => {
        console.error(e.error || e);
        const errorMessage = "The following error occurred on the server:\n\n" + e.text || e.error;
        if (e.errorMessage || e.feedback || e.error) {
            console.error(e.text || e.error);
        }
        if (errorHandler) {
            errorHandler({...e, title: "Server error", feedback: errorMessage, isError: true});
        }
    });
}

export default fetchJson;