const handleFeedback = (setStateFunctions, response, customOptions = {}, callback = () => {
}) => {
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
        setStateFunctions.toasts(prevState => {
            return [...prevState, {
                title: response.title || response.feedback || "Operation successful",
                bodyText: response.title ? response.feedback : "The operation was completed successfully",
                id: `${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`,
                ...customOptions
            }]
        });
        callback(response);
    } else {
        setStateFunctions.acknowledgeModal(prevState => {
            return {
                ...defaultState,
                ...prevState,
                show: true,
                bodyText: response.feedback || "An unknown error occurred",
                title: response.title || "Error",
            }
        })
    }
}

export default handleFeedback;