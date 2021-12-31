import validateForm from "../../functions/formValidation";
import {variantPairings} from "../common/styles";

export const makeRows = (type, data, editId, functions) => {
    const rowFunctions = {
        item: () => {
            return data.map(item => {
                return (
                    item.id !== editId ? [
                        item.id,
                        item.name,
                        `${item.currentStock} ${item.unit}`,
                        `${item.warningLevel} ${item.unit}`,
                        !editId ? {
                            type: "button",
                            id: 1,
                            text: "Edit",
                            buttonClass: "btn-warning btn-sm",
                            handler: () => {
                                functions.setEditId(item.id)
                            }
                        } : {text: ""},
                        !editId ? {
                            type: "button",
                            id: 1,
                            text: "Delete",
                            buttonClass: "btn-danger btn-sm",
                            handler: () => {
                                functions.setModalOptions(prevState => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        deleteId: item.id,
                                        targetName: item.name,
                                        bodyText: `Are you sure you want to delete ${item.name}?\n\nThe item will also be removed from any lists containing it.`,
                                        handleNo: () => {
                                            functions.setModalOptions(prevState => {
                                                return {...prevState, show: false}
                                            })
                                        },
                                        handleYes: () => functions.deleteEntry(item.id, item.name)
                                    }
                                })
                            }
                        } : {text: ""}
                    ] : makeEditRow(type, item, functions)
                )
            })
        }
    }
    return rowFunctions[type]();
}
const makeEditRow = (type, entry, functions) => {
    const editRowFunctions = {
        item: () => {
            const inputIds = {
                name: `editItemRow-${entry.id}-name`,
                unit: `editItemRow-${entry.id}-unit`,
                warningLevel: `editItemRow-${entry.id}-wanringLevel`
            };
            return [
                entry.id,
                {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.name,
                        label: "Item name",
                        defaultValue: entry.name,
                        form: "editItemForm",
                        forceCase: "title"
                    },
                    invalidFeedback: "You must specify a name",
                    sortValue: entry.name
                }, {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.unit,
                        label: "Unit name",
                        defaultValue: entry.unit && entry.unit ? entry.unit.trim() : "",
                        form: "editItemForm",
                        forceCase: "lower"
                    },
                    invalidFeedback: "You must specify a unit type",
                    sortValue: `${entry.currentStock} ${entry.unit}`
                }, {
                    type: "input",
                    props: {
                        type: "number",
                        id: inputIds.warningLevel,
                        label: "Warning level",
                        defaultValue: entry.warningLevel,
                        form: "editItemForm",
                    },
                    invalidFeedback: "You must specify a warning level",
                    sortValue: `${entry.warningLevel} ${entry.unit}`
                }, {
                    type: "submit",
                    buttonClass: "btn-success",
                    text: "Save",
                    id: entry.id,
                    className: "text-center buttonCell",
                    form: "editItemForm",
                    handler: (e) => {
                        validateForm(e, [inputIds.name, inputIds.unit, inputIds.warningLevel], (x) => {
                            if (x.isValid) {
                                functions.editEntry({
                                    name: x.values[inputIds.name],
                                    unit: x.values[inputIds.unit],
                                    warningLevel: x.values[inputIds.warningLevel],
                                    id: entry.id
                                })
                            }
                        })
                    }
                }, {
                    type: "button",
                    buttonClass: "btn-danger",
                    text: "Cancel",
                    id: entry.id,
                    className: "text-center buttonCell",
                    handler: functions.getEntries
                }];
        }
    }
    return editRowFunctions[type]();
}
export const makeUndeleteRow = (type, data, functions) => {
    const deleteRowFunctions = {
        item: () => {
            return data.map(item => {
                return ([
                        item.id,
                        item.name,
                        `${item.currentStock} ${item.unit}`,
                        item.lastUpdated,
                        {
                            type: "button",
                            text: "Restore",
                            buttonClass: "btn-warning btn-sm",
                            handler: () => {
                                functions.setModalOptions(prevState => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        deleteId: item.id,
                                        targetName: item.name,
                                        bodyText: `Are you sure you want to restore ${item.name}?\n\nThe item will also be re-added to any lists that contained it.`,
                                        handleNo: () => {
                                            functions.setModalOptions(prevState => {
                                                return {...prevState,
                                                    show: false,
                                                    headerClass: variantPairings.warning.header,
                                                    buttonVariant: "warning"
                                                }
                                            })
                                        },
                                        handleYes: () => functions.restoreEntry(item.id, item.name)
                                    }
                                })
                            }
                        }
                    ]
                )
            })
        }
    }
    return deleteRowFunctions[type]();
}
