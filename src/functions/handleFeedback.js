const HandleFeedback = (setStateFunctions, response, customOptions = {}, callback = null) => {
    const defaultState = {
        headerClass: "bg-warning text-primary",
        yesButtonVariant: "primary",
        handleClick: () => {
            setStateFunctions.acknowledgeModal(prevState => {
                return {
                    ...prevState,
                    show: false,
                }
            })
            callback({response});
        }
    }
    if (response.success) {
        setStateFunctions.completeToast((prevState => {
            return {
                ...prevState,
                ...customOptions,
                show: true,
                title: response.feedback,
            };
        }))
        callback(response);
    } else {
        setStateFunctions.acknowledgeModal(prevState => {
            return {
                ...defaultState,
                ...prevState,
                show: true,
                bodyText: response.feedback,
                title: response.errorType === "listExists" ? "List already exists" : "Missing item"
            }
        })
    }
}

export default HandleFeedback;