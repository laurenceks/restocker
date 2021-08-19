const fetchWithAuthCheck = (url, options, responseType = "json") => {
    const logoutDueToResponse = (msg = "User not logged in on the server") => {
        window.location = `${(window.location.hostname.startsWith("localhost") || window.location.hostname.startsWith("127") || window.location.hostname.startsWith("192")) && "/#"}/logout`;
    }
    return fetch(url, options).then(async response => {
        if (response.status === 401) {
            logoutDueToResponse("401 - permission denied");
            return;
        }
        if (response.ok) {
            const responseText = await response.text();
            try {
                const responseJson = JSON.parse(responseText)
                if (!responseJson.failedLoginCheck) {
                    return responseType === "json" ? responseJson : responseType === "text" ? responseText : response
                } else {
                    logoutDueToResponse("401 - permission denied");
                    return Promise.reject("401 - permission denied");
                }
            } catch (e) {
                return Promise.reject({error: e, text: responseText});
            }
        } else {
            return Promise.reject(new Error(await response.text()));
        }
    })
}

export default fetchWithAuthCheck;