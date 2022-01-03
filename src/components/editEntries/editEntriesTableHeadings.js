const entryTableHeadings = {
    item: ["ID", "Name", "Current stock", {text: "Warning level", colspan: 3}],
    location: ["ID", {text: "Name", colspan: 3}],
    list: ["ID", "Name", "Item", "Quantity", {text: "", colspan: 3}],
}
const deletedEntryTableHeadings = {
    item: ["ID", "Name", "Stock on deletion", {text: "Deleted", colspan: 2}],
    location: ["ID", "Name", {text: "Deleted", colspan: 2}],
    list: ["ID", {text: "Name", colspan: 2}],
}


export {entryTableHeadings, deletedEntryTableHeadings};
