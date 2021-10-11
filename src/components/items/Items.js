import LoginInput from "../login/loginComponents/LoginInput";
import {useEffect, useState} from "react"

import {dummyItems, dummyLists} from "../common/dummyData";
import LoginCheckbox from "../login/loginComponents/LoginCheckbox";
import Table from "../common/tables/Table";
import fetchJson from "../../functions/fetchJson";

const Items = () => {
    const [newItem, setNewItem] = useState({});
    const [editItem, setEditItem] = useState({});
    const [itemList, setItemList] = useState([]);

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
                                buttonClass: "btn-warning",
                                handler: (e) => {
                                    console.log("Edit row item " + index + "!");
                                }
                            }, {
                            type: "button",
                            id: 1,
                            text: "Delete",
                            buttonClass: "btn-danger",
                            handler: (e) => {
                                console.log("Delete row item " + index + "!");
                            }
                        }
                        ]
                    )
                }
            )
            setItemList(newItemsList);
        });
    }

    useEffect(() => {
        //get user list
        getItems();
    }, []);

    return (
        <div className="container">
            <form>
                <div className="row my-3">
                    <h2>Add new item</h2>
                    <div className="col">
                        <LoginInput type={"text"} id={"inputAddItemName"} label={"Name"}
                                    invalidFeedback={"You must name your item"}/>
                    </div>
                    <div className="col">
                        <LoginInput type={"text"} id={"inputAddItemUnit"} label={"Base unit"}/>
                    </div>
                    <div className="col d-flex align-items-center">
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