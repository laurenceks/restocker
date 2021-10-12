import LoginInput from "../login/loginComponents/LoginInput";
import {useEffect, useRef, useState} from "react"
import Table from "../common/tables/Table";
import fetchJson from "../../functions/fetchJson";
import validateForm from "../../functions/formValidation";

const Items = () => {
    const [editItem, setEditItem] = useState({});
    const [itemList, setItemList] = useState([[0, "Initial", "0 initial units", "", ""]]);

    const addItemForm = useRef();
    const editItemForm = useRef();

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
                                handler: (e) => {
                                    showEditRow(index);
                                }
                            }, {
                            type: "button",
                            id: 1,
                            text: "Delete",
                            buttonClass: "btn-danger btn-sm",
                            handler: (e) => {
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
        console.log(x.values);
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
            body: JSON.stringify({id:id}),
        }, (x) => {
            getItems();
        });
    }

    const showEditRow = (x) => {
        if (itemList[x]) {
            const newItemList = [...itemList];
            const unitText = itemList[x][2].match(/\d+ (.*)/)
            newItemList[x] = [
                itemList[x][0],
                {
                    type: "input",
                    props: {type: "text", id: `addItemRow-name-${x}`, label: "Item name", defaultValue: itemList[x][1]},
                    invalidFeedback: "You must specify a name"
                }, {
                    type: "input",
                    props: {
                        type: "text",
                        id: `addItemRow-units-${x}`,
                        label: "Unit name",
                        defaultValue: unitText && unitText[1] ? unitText[1].trim() : "",
                        form: "editItemForm",
                    },
                    invalidFeedback: "You must specify a unit type"
                }, {
                    type: "submit",
                    buttonClass: "btn-success",
                    text: "Save",
                    id: itemList[x][0],
                    className: "text-center buttonCell",
                    form: "editItemForm"
                }, {
                    type: "button",
                    buttonClass: "btn-danger",
                    text: "Cancel",
                    id: itemList[x][0],
                    className: "text-center buttonCell",
                    handler: getItems
                }];
            setItemList(newItemList);
        } else {
            //list error - get them again
            getItems();
        }
    }

    useEffect(() => {
        //get user list
        getItems();
    }, []);

    useEffect(() => {
        //get user list
        console.log("Updated item list");
        console.log(itemList);
    }, []);

    return (
        <div className="container">
            <form ref={addItemForm} onSubmit={(e) => {
                validateForm(e, addItemForm, addItem);
            }}>
                <div className="row my-3">
                    <h2>Add new item</h2>
                    <div className="col">
                        <div className="loginFormInputGroup">
                            <LoginInput type={"text"} id={"inputAddItemName"} label={"Name"}
                                        invalidFeedback={"You must name your item"}/>
                        </div>
                    </div>
                    <div className="col">
                        <div className="loginFormInputGroup">
                            <LoginInput type={"text"} id={"inputAddItemUnit"} label={"Base unit"}
                                        invalidFeedback={"You must specify a unit type"}/>
                        </div>
                    </div>
                    <div className="col d-flex align-items-center">
                        <button type={"submit"} className={"btn btn-success"}>Add</button>
                    </div>
                </div>
            </form>
            <div className="row my-3">
                <h2>All items</h2>
                <form ref={editItemForm} onSubmit={(e) => {
                    validateForm(e, editItemForm, (e) => {
                        console.log("Edit form validated!")
                    });
                    console.log("Edit form submitted!")
                }}>
                    <Table
                        headers={["ID", "Name", {text: "Current stock", colspan: 3}]}
                        rows={itemList}
                    />
                </form>
            </div>
        </div>
    );
};

export default Items;