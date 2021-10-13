import fetchJson from "./fetchJson";

const fetchAllItems = (callback) => {
    fetchJson("./php/items/getAllItems.php", {
        method: "GET"
    }, callback);
}

export default fetchAllItems;