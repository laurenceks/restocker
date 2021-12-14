import fetchJson from "../functions/fetchJson";
import useFeedback from "./useFeedback";
import {useContext} from "react";
import {GlobalAppContext} from "../App.js";

const fetchOptions = {
    getItems: {url: "./php/items/getAllItems.php", method: "GET"},
    addItem: {url: "./php/items/addItem.php", method: "POST"},
    editItem: {url: "./php/items/editItem.php", method: "POST"},
    deleteItem: {url: "./php/items/deleteItem.php", method: "POST"},
    getLocations: {url: "./php/locations/getAllLocations.php", method: "GET"},
    addLocation: {url: "./php/locations/addLocation.php", method: "POST"},
    editLocation: {url: "./php/locations/editLocation.php", method: "POST"},
    deleteLocation: {url: "./php/locations/deleteLocation.php", method: "POST"},
    getLists: {url: "./php/lists/getAllLists.php", method: "GET"},
    addList: {url: "./php/lists/addList.php", method: "POST"},
    editList: {url: "./php/lists/editList.php", method: "POST"},
    deleteList: {url: "./php/lists/deleteList.php", method: "POST"},
    getUsers: {url: "./php/users/getAllUsers.php", method: "GET"},
    deleteUser: {url: "./php/users/deleteUser.php", method: "POST"},
    approveUser: {url: "./php/users/approveUser.php", method: "POST"},
    makeUserAdmin: {url: "./php/users/deleteUser.php", method: "POST"},
    makeAdminUser: {url: "./php/users/makeAdminUser.php", method: "POST"},
    manuallyVerifyUser: {url: "./php/users/manuallyVerifyUser.php", method: "POST"},
    suspendUser: {url: "./php/users/suspendUser.php", method: "POST"},
    unsuspendUser: {url: "./php/users/unsuspendUser.php", method: "POST"},
    getItemsAndLocations: {url: "./php/items/getAllItemsAndLocations.php", method: "GET"},
    getRates: {url: "./php/items/getRates.php", method: "POST"},
}

export const useFetch = () => {

    const handleFeedback = useFeedback();
    const setToast = useContext(GlobalAppContext)[0].setStateFunctions.toasts;

    return ({type, options = {}, callback = null, feedbackOptions = {}, dontHandleFeedback = false}) => {
        const slowFetchTimeout = setTimeout(() => {
            setToast(prevState => {
                return [...prevState, {
                    title: "Still loading",
                    bodyText: "The server is taking a long time to respond - your data will load when ready",
                    variant: "warning",
                    id: `${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`,
                }]
            })
        }, 2000)
        fetchJson(fetchOptions[type].url, {method: fetchOptions[type].method, ...options}, (response) => {
            clearTimeout(slowFetchTimeout);
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