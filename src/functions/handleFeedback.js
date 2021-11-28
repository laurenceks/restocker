const handleFeedback = (setStateFunctions, response, customOptions = {}, callback = ()=>{}) => {
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
                title: response.feedback,
                show: true,
                ...customOptions,
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

export default handleFeedback;