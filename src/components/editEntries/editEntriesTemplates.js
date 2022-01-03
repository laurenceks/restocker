import AddFormItem from "./addEntryForms/AddFormItem.js";
import AddFormLocation from "./addEntryForms/AddFormLocation";
import AddFormList from "./addEntryForms/AddFormList";

const addDataTemplates = {
    item: {
        name: "",
        unit: "units",
        warningLevel: 5
    },
    location: {
        name: ""
    },
    list: {
        name: "",
        itemId: null,
        itemName: null,
        unit: null,
        quantity: "",
        selected: [],
    },
    listItem: {
        id: null,
        name: null,
        items: [],
        index: null,
    }
}

const addDataForms = {
    item: AddFormItem,
    location: AddFormLocation,
    list: AddFormList,
}

export {addDataTemplates, addDataForms};
