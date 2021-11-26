import FormInput from "../common/forms/FormInput";
import {useEffect, useRef, useState} from "react"
import Table from "../common/tables/Table";
import fetchJson from "../../functions/fetchJson";
import validateForm from "../../functions/formValidation";
import fetchAllItems from "../../functions/fetchAllItems";
import naturalSort from "../../functions/naturalSort";
import ConfirmModal from "../Bootstrap/ConfirmModal";

const Items = () => {
    class addDataTemplate {
        constructor() {
            this.name = "";
            this.unit = [];
            this.warningLevel = 5;
        }
    }

    const [addData, setAddData] = useState(new addDataTemplate());
    const [editId, setEditId] = useState(null);
    //TODO add sort key to table headers on click
    const [sortKey, setSortKey] = useState("name");
    const [itemList, setItemList] = useState([[0, "", "", "", "", ""]]);
    const [modalOptions, setModalOptions] = useState({
        show: false,
        deleteId: null,
        bodyText: "",
        headerClass: "bg-danger text-light",
        yesButtonVariant: "danger"
    });

    const addItemForm = useRef();
    const itemListRef = useRef([]);

    itemListRef.current = itemList;

    const getItems = () => {
        fetchAllItems(processItems)
    }

    const processItems = (x) => {
        const newItemsList = []
        x.items.map((x) => {
            return {...x, sortKey: x[sortKey]}
        }).sort(naturalSort).forEach((item, index) => {
                newItemsList.push(
                    [
                        item.id,
                        item.name,
                        `${item.currentStock} ${item.unit}`,
                        `${item.warningLevel} ${item.unit}`,
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
                                setModalOptions(prevState => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        deleteId: item.id,
                                        bodyText: `Are you sure you want to delete ${item.name}?\n\nThe item will also be removed from any lists containing it.`
                                    }
                                })
                            }
                        }
                    ]
                )
            }
        )
        setItemList(newItemsList);
    }

    const addItem = (x) => {
        fetchJson("./php/items/addItem.php", {
            method: "POST",
            body: JSON.stringify(x.values),
        }, (x) => {
            setAddData(new addDataTemplate());
            getItems();
        });
    }

    const deleteItem = (id) => {
        fetchJson("./php/items/deleteItem.php", {
            method: "POST",
            body: JSON.stringify({id: id}),
        }, (x) => {
            setModalOptions(prevState => {
                return {...prevState, show: false}
            })
            getItems();
        });
    }
    const editItem = (x) => {
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
            const inputIds = {
                name: `editItemRow-${editId}-name`,
                unit: `editItemRow-${editId}-unit`,
                warningLevel: `editItemRow-${editId}-wanringLevel`
            }
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
                    type: "input",
                    props: {
                        type: "number",
                        id: inputIds.warningLevel,
                        label: "Warning level",
                        defaultValue: 5,
                        form: "editItemForm",
                    },
                    invalidFeedback: "You must specify a warning level"
                }, {
                    type: "submit",
                    buttonClass: "btn-success",
                    text: "Save",
                    id: itemId,
                    className: "text-center buttonCell",
                    form: "editItemForm",
                    handler: (e) => {
                        setEditId(itemId);
                        validateForm(e, [inputIds.name, inputIds.unit, inputIds.warningLevel], (x) => {
                            editItem({
                                name: x.values[inputIds.name],
                                unit: x.values[inputIds.unit],
                                warningLevel: x.values[inputIds.warningLevel],
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

    return (
        <div className="container">
            <form ref={addItemForm} onSubmit={(e) => {
                validateForm(e, addItemForm, addItem);
            }}>
                <div className="row my-3">
                    <h2>Add new item</h2>
                    <div className="col-12 col-md-4 mb-3 mb-md-0">
                        <div className="loginFormInputGroup">
                            <FormInput type={"text"}
                                       id={"inputAddItemName"}
                                       label={"Name"}
                                       invalidFeedback={"You must name your item"}
                                       forceCase={"title"}
                                       value={addData.name}
                                       onChange={(e, x) => {
                                           setAddData({...addData, name: x})
                                       }}/>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 mb-3  mb-md-0">
                        <div className="loginFormInputGroup">
                            <FormInput type={"text"}
                                       id={"inputAddItemUnit"}
                                       label={"Base unit"}
                                       invalidFeedback={"You must specify a unit type"}
                                       forceCase={"lower"}
                                       value={addData.unit}
                                       onChange={(e, x) => {
                                           setAddData({...addData, unit: x})
                                       }}/>
                        </div>
                    </div>
                    <div className="col-12 col-md-2 mb-3  mb-md-0">
                        <div className="loginFormInputGroup">
                            <FormInput type={"number"}
                                       id={"inputAddItemWarningLevel"}
                                       label={"Warning level"}
                                       invalidFeedback={"You must specify a warning level"}
                                       min={0}
                                       value={addData.warningLevel}
                                       onChange={(e, x) => {
                                           setAddData({...addData, warningLevel: x})
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
                    rows={itemList}
                />
            </div>
            <ConfirmModal
                {...modalOptions}
                handleNo={() => {
                    setModalOptions(prevState => {
                        return {...prevState, show: false}
                    });
                }}
                handleYes={() => deleteItem(modalOptions.deleteId)}
            />
        </div>
    );
};

export default Items;