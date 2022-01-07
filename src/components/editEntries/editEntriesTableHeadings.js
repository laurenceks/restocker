const entryTableHeadings = {
    item: ["ID", "Name", "Current stock", {text: "Warning level", colspan: 2}],
    location: ["ID", {text: "Name", colspan: 2}],
    list: ["ID", "Name", "Item", "Quantity", {text: "", colspan: 2}],
}
const deletedEntryTableHeadings = {
    item: ["ID", "Name", "Stock on deletion", {text: "Deleted", colspan: 2}],
    location: ["ID", "Name", {text: "Deleted", colspan: 2}],
    list: ["ID", {text: "Name", colspan: 2}],
}


export {entryTableHeadings, deletedEntryTableHeadings};
