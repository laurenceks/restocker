import fetchJson from "../functions/fetchJson";
import useFeedback from "./useFeedback";

const urls = {
    getAllItems: "./php/items/getAllItems.php",
    getAllItemsAndLocations: "./php/items/getAllItemsAndLocations.php",
    getRates: "./php/items/getRates.php",
}

export const useFetch = () => {

    const handleFeedback = useFeedback();

    return ({type, options = {method: "GET"}, callback = null, feedbackOptions = {}, dontHandleFeedback = false}) => {
        fetchJson(urls[type], options, (response) => {

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