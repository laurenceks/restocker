import LoginInput from "../login/forms/LoginInput";
import {useEffect, useRef, useState} from "react"
import Table from "../common/tables/Table";
import fetchJson from "../../functions/fetchJson";
import validateForm from "../../functions/formValidation";

const Items = () => {
    const [editId, setEditId] = useState(null);
    const [itemList, setItemList] = useState([[0, "Initial", "0 initial units", "", ""]]);

    const addItemForm = useRef();
    const itemListRef = useRef([]);

    itemListRef.current = itemList;

    const getItems = () => {
        fetchJson("./php/items/getAllItems.php", {
            method: "GET"
        }, (x) => {
            const newItemsList = []
            x.items.forEach((item, index) => {
                    newItemsList.push(
                        [
                            item.id,
                            item.name,
                            `${item.currentStock} ${item.unit}`,
                            {
                                type: "button",
                                id: 1,
                                text: "Edit",
                                buttonClass: "btn-warning btn-sm",
                                handler: () => {
                                    showEditRow(index);
                                }
                            },
                            {
                                type: "button",
                                id: 1,
                                text: "Delete",
                                buttonClass: "btn-danger btn-sm",
                                handler: () => {
                                    deleteItem(item.id);
                                }
                            }
                        ]
                    )
                }
            )
            setItemList(newItemsList);
        });
    }

    const addItem = (x) => {
        fetchJson("./php/items/addItem.php", {
            method: "POST",
            body: JSON.stringify(x.values),
        }, (x) => {
            getItems();
        });
    }

    const deleteItem = (id) => {
        fetchJson("./php/items/deleteItem.php", {
            method: "POST",
            body: JSON.stringify({id: id}),
        }, (x) => {
            getItems();
        });
    }
    const editItem = (x) => {
        console.log(x)
        fetchJson("./php/items/editItem.php", {
            method: "POST",
            body: JSON.stringify(x),
        }, (x) => {
            getItems();
        });
    }

    const showEditRow = (x) => {
        if (itemListRef.current[x]) {
            const newItemList = [...itemListRef.current];
            const unitText = itemListRef.current[x][2].match(/\d+ (.*)/)
            const itemId = itemListRef.current[x][0];
            const inputIds = {name: `editItemRow-${editId}-name`, unit: `editItemRow-${editId}-unit`}
            newItemList[x] = [
                itemId,
                {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.name,
                        label: "Item name",
                        defaultValue: itemListRef.current[x][1],
                        form: "editItemForm",
                        forceCase: "title"
                    },
                    invalidFeedback: "You must specify a name"
                }, {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.unit,
                        label: "Unit name",
                        defaultValue: unitText && unitText[1] ? unitText[1].trim() : "",
                        form: "editItemForm",
                        forceCase: "lower"
                    },
                    invalidFeedback: "You must specify a unit type"
                }, {
                    type: "submit",
                    buttonClass: "btn-success",
                    text: "Save",
                    id: itemId,
                    className: "text-center buttonCell",
                    form: "editItemForm",
                    handler: (e) => {
                        setEditId(itemId);
                        validateForm(e, [inputIds.name, inputIds.unit], (x) => {
                            editItem({
                                name: x.values[inputIds.name],
                                unit: x.values[inputIds.unit],
                                id: itemId
                            })
                        })
                    }
                }, {
                    type: "button",
                    buttonClass: "btn-danger",
                    text: "Cancel",
                    id: itemId,
                    className: "text-center buttonCell",
                    handler: getItems
                }];
            setItemList(newItemList);
        }
    }

    useEffect(() => {
        //get user list
        getItems();
    }, []);

    useEffect(() => {
        //get user list
    }, [itemList]);

    return (
        <div className="container">
            <form ref={addItemForm} onSubmit={(e) => {
                validateForm(e, addItemForm, addItem);
            }}>
                <div className="row my-3">
                    <h2>Add new item</h2>
                    <div className="col-12 col-md-5 mb-3  mb-md-0">
                        <div className="loginFormInputGroup">
                            <LoginInput type={"text"} id={"inputAddItemName"}
                                        label={"Name"}
                                        invalidFeedback={"You must name your item"}
                                        forceCase={"title"}/>
                        </div>
                    </div>
                    <div className="col-12 col-md-5 mb-3  mb-md-0">
                        <div className="loginFormInputGroup">
                            <LoginInput type={"text"} id={"inputAddItemUnit"}
                                        label={"Base unit"}
                                        invalidFeedback={"You must specify a unit type"}
                                        forceCase={"lower"}/>
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
                    headers={["ID", "Name", {text: "Current stock", colspan: 3}]}
                    rows={itemList}
                />
            </div>
        </div>
    );
};

export default Items;