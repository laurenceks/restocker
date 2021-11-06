import fetchJson from "./fetchJson";

const fetchAllItems = (callback, getLocations = false) => {
    fetchJson(getLocations ? "./php/items/getAllItemsAndLocations.php" : "./php/items/getAllItems.php", {
        method: "GET"
    }, callback);
}

export default fetchAllItems;