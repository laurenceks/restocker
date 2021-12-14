import fetchJson from "../functions/fetchJson";
import useFeedback from "./useFeedback";
import {useRef, useContext} from "react";
import {GlobalAppContext} from "../App.js";
import {IoWarningOutline} from "react-icons/all";


const urls = {
    getAllItems: "./php/items/getAllItems.php",
    getAllItemsAndLocations: "./php/items/getAllItemsAndLocations.php",
    getRates: "./php/items/getRates.php",
}

export const useFetch = () => {

    const handleFeedback = useFeedback();
    const slowFetchTimeout = useRef(null);
    const setToast = useContext(GlobalAppContext)[0].setStateFunctions.toasts;

    return ({type, options = {method: "GET"}, callback = null, feedbackOptions = {}, dontHandleFeedback = false}) => {
        slowFetchTimeout.current = setTimeout(() => {
            setToast(prevState => {
                return [...prevState, {
                    title: "Still loading",
                    bodyText: "The server is taking a long time to respond - your data will load when ready",
                    variant: "warning",
                    id: `${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`,
                }]
            })
        }, 2000)
        fetchJson(urls[type], options, (response) => {
            clearTimeout(slowFetchTimeout.current);
            if (callback) {
                callback(response, handleFeedback);
                if (!dontHandleFeedback) {
                    handleFeedback({...response, customOptions: feedbackOptions})
                }
            } else if (!dontHandleFeedback) {
                handleFeedback({...response, customOptions: feedbackOptions})
            }
        });
    }
}

export default useFetch;