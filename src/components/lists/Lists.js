import FormInput from "../common/forms/FormInput";
import {Fragment, useEffect, useRef, useState} from "react"
import Table from "../common/tables/Table";
import fetchJson from "../../functions/fetchJson";
import validateForm from "../../functions/formValidation";
import fetchAllItems from "../../functions/fetchAllItems";
import naturalSort from "../../functions/naturalSort";
import {log10} from "chart.js/helpers";
import deepmerge from "deepmerge";

const Lists = () => {
        class addDataTemplate {
            constructor() {
                this.name = "";
                this.items = [];
            }
        }

        const [addData, setAddData] = useState(new addDataTemplate());
        const [editId, setEditId] = useState(null);
        const [sortKey, setSortKey] = useState("name");
        const [listList, setListList] = useState([]);
        const [listsById, setListsById] = useState([]);
        const [listRows, setListRows] = useState([]);
        const addListForm = useRef();
        const listRowsRef = useRef(listRows);
        listRowsRef.current = listRows;

        class editListDataTemplate {
            constructor() {
                this.id = null;
                this.name = null;
                this.items = [];
            }
        }

        const [editedList, setEditedList] = useState(new editListDataTemplate());

        const getLists = (callback, getLocations = false) => {
            setEditedList(new editListDataTemplate());
            console.log("getting")
            fetchJson("./php/lists/getAllLists.php", {
                method: "GET"
            }, processLists);
        }

        useEffect(() => {
            //trigger hover effect
            document.querySelectorAll(`.td-listId-${editedList.id}`).forEach((x) => {
                x.classList.add("hover")
            })
        }, [listRows, editedList]);


        const processLists = (x) => {
            setListList(x?.lists || null);
            const newListRows = []
            const newListsById = {};
            x?.lists?.forEach((x) => {
                newListsById[x.id] = x;
                const cellTemplate = {cellData: {"data-listid": x.id}, className: `td-listId-${x.id}`};
                x.items.forEach((y, i) => {
                    const currentLength = newListRows.length;
                    newListRows.push((i === 0 ? [
                        {
                            ...cellTemplate,
                            rowspan: x.items.length,
                            text: x.id
                        },
                        {
                            ...cellTemplate,
                            rowspan: x.items.length,
                            text: x.name,
                        }] : []).concat(
                        [{
                            ...cellTemplate,
                            text: y.itemName
                        }, {
                            ...cellTemplate,
                            text: y.quantity
                        }]).concat(i === 0 ? [{
                        ...cellTemplate,
                        type: "button",
                        text: "Edit",
                        buttonClass: "btn-warning",
                        rowspan: x.items.length,
                        className: "text-center " + cellTemplate.className,
                        handler: () => {
                            setEditedList(x);
                            showEditRow(x, currentLength);
                        }
                    }, {
                        ...cellTemplate,
                        type: "button",
                        text: "Delete",
                        buttonClass: "btn-danger",
                        rowspan: x.items.length,
                        className: "text-center " + cellTemplate.className,
                        handler: () => {
                            console.log("Delete!");
                        }
                    }] : []));
                });
            })
            setListsById(newListsById);
            setListRows(newListRows);
        }

        const addList = (x) => {
            fetchJson("./php/lists/addList.php", {
                method: "POST",
                body: JSON.stringify(x.values),
            }, (x) => {
                setAddData(new addDataTemplate());
                getLists();
            });
        }

        const deleteList = (id) => {
            fetchJson("./php/lists/deleteList.php", {
                method: "POST",
                body: JSON.stringify({id: id}),
            }, (x) => {
                getLists();
            });
        }
        const editList = (x) => {
            fetchJson("./php/lists/editList.php", {
                method: "POST",
                body: JSON.stringify(x),
            }, (x) => {
                getLists();
            });
        }

        const showEditRow = (x, start) => {
            setEditedList({id: x.id, name: x.name, items: x.items})
            const cellTemplate = {
                cellData: {"data-listid": x.id},
                className: `td-listId-${x.id}`,
                cellAlignClass: "align-top"
            };
            const newEditRow = [];
            const firstRow = [
                {...cellTemplate, text: x.id, rowspan: x.items?.length + 1 || 1},
                {
                    ...cellTemplate,
                    rowspan: x.items?.length + 1 || 1,
                    type: "input",
                    props: {
                        type: "text",
                        label: "Name",
                        id: `input-listId-${x.id}-name`,
                        defaultValue: x.name,
                        onChange: (e, v) => {
                            setEditedList({...editedList, name: v})
                        }
                    }
                }];
            x.items.forEach((y, i) => {
                    newEditRow.push((i === 0 ? firstRow : []).concat(
                        [{
                            ...cellTemplate,
                            type: "input",
                            props: {
                                label: "Item",
                                id: `input-listId-${x.id}-itemId-${y.itemId}-name`,
                                defaultValue: x.items[i]?.itemName,
                                onChange: (e, v) => {
                                    x.items.splice(i, 1, {
                                        ...x.items[i],
                                        name: v
                                    })
                                    setEditedList({...editedList, items: x.items})
                                }
                            }
                        }
                            , {
                            ...cellTemplate,
                            type: "input",
                            props: {
                                label: "Quantity",
                                type: "Number",
                                id: `input-listId-${x.id}-itemId-${y.itemId}-quantity`,
                                defaultValue: x.items[i]?.quantity,
                                onChange: (e, v) => {
                                    x.items.splice(i, 1, {
                                        ...x.items[i],
                                        quantity: v
                                    })
                                    setEditedList({...editedList, items: x.items})
                                }
                            }
                        }
                        ])
                    )
                    ;
                }
            )
            ;
            newEditRow.push([{
                ...cellTemplate,
                type: "button",
                text: "Add item",
                buttonClass: "btn-primary",
                className: cellTemplate.className,
                handler: () => {
                    console.log("Add new item!");
                }
            }, {
                ...cellTemplate,
                fragment: <Fragment>
                    <button className="btn btn-success me-3" onClick={() => console.log("Save")}>Save</button>
                    <button className="btn btn-danger" onClick={() => getLists()}>Cancel</button>
                </Fragment>,
                className: cellTemplate.className,
            }]);
            const newListRows = [...listRowsRef.current].map((x) => {
                return x.map((y) => {
                    //remove buttons from all cells
                    return y.type === "button" ? "" : y;
                })
            });
            newListRows.splice(start, newEditRow.length - 1, ...newEditRow);
            setListRows(newListRows);
        }

        useEffect(() => {
            //get list list
            getLists();
        }, []);

        return (
            <div className="container">
                <form ref={addListForm} onSubmit={(e) => {
                    validateForm(e, addListForm, addList);
                }}>
                    <div className="row my-3">
                        <h2 className="mb-3">Add new list</h2>
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
                        <div className="col-12 col-md-2 d-flex align-items-center">
                            <button type={"submit"} className={"btn btn-success"}>Add</button>
                        </div>
                    </div>
                </form>
                <div className="row my-3">
                    <h2>All lists</h2>
                    <Table headers={["ID", "Name", "Item", "Quantity"]}
                           rows={listRows}
                           rowEnter={(e) => {
                               document.querySelectorAll(`.td-listId-${e.target.dataset.listid}`).forEach((x) => {
                                   x.classList.add("hover")
                               })
                           }}
                           rowLeave={(e) => {
                               document.querySelectorAll(`.td-listId-${e.target.dataset.listid}`).forEach((x) => {
                                   x.classList.remove("hover")
                               })
                           }}/>
                </div>
            </div>
        );
    }
;

export default Lists;