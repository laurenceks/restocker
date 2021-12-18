import {useContext, useEffect, useRef, useState} from "react"
import useFetch from "../../hooks/useFetch";
import FormInput from "../common/forms/FormInput";
import Table from "../common/tables/Table";
import validateForm from "../../functions/formValidation";
import {GlobalAppContext} from "../../App";

const Items = () => {
        const addDataTemplate = {
            name: "",
            unit: "units",
            warningLevel: 5
        }

        const fetchHook = useFetch();
        const setModalOptions = useContext(GlobalAppContext)[0].setStateFunctions.confirmModal;
        const [addItemData, setAddItemData] = useState({...addDataTemplate});
        const [editId, setEditId] = useState(null);
        const [itemList, setItemList] = useState([]);
        const addItemForm = useRef();
        const itemsLoadedOnce = useRef(false);

        const getItems = () => {
            setEditId(null);
            fetchHook({
                type: "getItems",
                dontHandleFeedback: !itemsLoadedOnce.current,
                callback: (result) => {
                    itemsLoadedOnce.current = true;
                    setItemList(result.items)
                }
            });
        }

        const makeItemRows = () => {
            return itemList.map(item => {
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
                                    setEditId(item.id)
                                }
                            } : {text: ""},
                            !editId ? {
                                type: "button",
                                id: 1,
                                text: "Delete",
                                buttonClass: "btn-danger btn-sm",
                                handler: () => {
                                    setModalOptions(prevState => {
                                        return {
                                            ...prevState,
                                            show: true,
                                            deleteId: item.id,
                                            targetName: item.name,
                                            bodyText: `Are you sure you want to delete ${item.name}?\n\nThe item will also be removed from any lists containing it.`,
                                            handleNo: () => {
                                                setModalOptions(prevState => {
                                                    return {...prevState, show: false}
                                                })
                                            },
                                            handleYes: () => deleteItem(item.id, item.name)
                                        }
                                    })
                                }
                            } : {text: ""}
                        ] : makeItemEditRow(item)
                    )
                }
            )
        }

        const makeItemEditRow = (item) => {
            const inputIds = {
                name: `editItemRow-${editId}-name`,
                unit: `editItemRow-${editId}-unit`,
                warningLevel: `editItemRow-${editId}-wanringLevel`
            };
            return [
                item.id,
                {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.name,
                        label: "Item name",
                        defaultValue: item.name,
                        form: "editItemForm",
                        forceCase: "title"
                    },
                    invalidFeedback: "You must specify a name",
                    sortValue: item.name
                }, {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.unit,
                        label: "Unit name",
                        defaultValue: item.unit && item.unit ? item.unit.trim() : "",
                        form: "editItemForm",
                        forceCase: "lower"
                    },
                    invalidFeedback: "You must specify a unit type",
                    sortValue: `${item.currentStock} ${item.unit}`
                }, {
                    type: "input",
                    props: {
                        type: "number",
                        id: inputIds.warningLevel,
                        label: "Warning level",
                        defaultValue: item.warningLevel,
                        form: "editItemForm",
                    },
                    invalidFeedback: "You must specify a warning level",
                    sortValue: `${item.warningLevel} ${item.unit}`
                }, {
                    type: "submit",
                    buttonClass: "btn-success",
                    text: "Save",
                    id: item.id,
                    className: "text-center buttonCell",
                    form: "editItemForm",
                    handler: (e) => {
                        validateForm(e, [inputIds.name, inputIds.unit, inputIds.warningLevel], (x) => {
                            if (x.isValid) {
                                editItem({
                                    name: x.values[inputIds.name],
                                    unit: x.values[inputIds.unit],
                                    warningLevel: x.values[inputIds.warningLevel],
                                    id: item.id
                                })
                            }
                        })
                    }
                }, {
                    type: "button",
                    buttonClass: "btn-danger",
                    text: "Cancel",
                    id: item.id,
                    className: "text-center buttonCell",
                    handler: getItems
                }]
        }

        const addItem = (form) => {
            fetchHook({
                type: "addItem",
                options: {
                    method: "POST",
                    body: JSON.stringify(form.values),
                },
                callback: (response) => {
                    setAddItemData({...addDataTemplate});
                    getItems();
                }
            });
        }

        const deleteItem = (id, name) => {
            fetchHook({
                type: "deleteItem",
                options: {
                    method: "POST",
                    body: JSON.stringify({id: id, name: name}),
                },
                callback: () => {
                    setModalOptions(prevState => {
                        return {...prevState, show: false}
                    })
                    getItems();
                }
            });
        }

        const editItem = (form) => {
            fetchHook({
                type: "editItem",
                options: {
                    method: "POST",
                    body: JSON.stringify(form),
                },
                callback: (response) => {
                    if (response.success || response.errorType !== "itemExists") {
                        getItems();
                    }
                }
            });
        }

        useEffect(() => {
            getItems();
        }, []);

        useEffect(() => {
            makeItemRows();
        }, [editId]);

        return (
            <div className="container">
                <form ref={addItemForm} onSubmit={(e) => {
                    validateForm(e, addItemForm, addItem);
                }}>
                    <div className="row my-3">
                        <h2>Add new item</h2>
                        <div className="col-12 col-md-4 mb-3 mb-md-0">
                            <div className="formInputGroup">
                                <FormInput type={"text"}
                                           id={"inputAddItemName"}
                                           label={"Name"}
                                           invalidFeedback={"You must name your item"}
                                           forceCase={"title"}
                                           value={addItemData.name}
                                           onChange={(e, x) => {
                                               setAddItemData(prevState => {
                                                   return {...prevState, name: x}
                                               })
                                           }}/>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 mb-3  mb-md-0">
                            <div className="formInputGroup">
                                <FormInput type={"text"}
                                           id={"inputAddItemUnit"}
                                           label={"Base unit"}
                                           invalidFeedback={"You must specify a unit type"}
                                           forceCase={"lower"}
                                           value={addItemData.unit}
                                           onChange={(e, x) => {
                                               setAddItemData(prevState => {
                                                   return {...prevState, unit: x}
                                               })
                                           }}/>
                            </div>
                        </div>
                        <div className="col-12 col-md-2 mb-3  mb-md-0">
                            <div className="formInputGroup">
                                <FormInput type={"number"}
                                           id={"inputAddItemWarningLevel"}
                                           label={"Warning level"}
                                           invalidFeedback={"You must specify a warning level"}
                                           min={0}
                                           value={addItemData.warningLevel}
                                           onChange={(e, x) => {
                                               setAddItemData(prevState => {
                                                   return {...prevState, warningLevel: x}
                                               })
                                           }}/>
                            </div>
                        </div>
                        <div className="col-12 col-md-2 d-flex align-items-center">
                            <button type={"submit"} className={"btn btn-success"}>Add</button>
                        </div>
                    </div>
                </form>
                <div className="row my-3">
                    <h2>All items</h2>
                    <Table
                        headers={["ID", "Name", "Current stock", {text: "Warning level", colspan: 3}]}
                        rows={makeItemRows(itemList)}
                        defaultSortIndex={1}
                    />
                </div>
            </div>
        );
    }
;

export default Items;