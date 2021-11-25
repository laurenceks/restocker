import FormInput from "../common/forms/FormInput";
import {Fragment, useEffect, useRef, useState} from "react"
import Table from "../common/tables/Table";
import fetchJson from "../../functions/fetchJson";
import validateForm from "../../functions/formValidation";
import fetchAllItems from "../../functions/fetchAllItems";
import naturalSort from "../../functions/naturalSort";
import {log10} from "chart.js/helpers";
import deepmerge from "deepmerge";
import FormItem from "../common/forms/FormItem";

const Lists = () => {
        class addDataTemplate {
            constructor() {
                this.name = "";
                this.itemId = null;
                this.unit = null;
                this.quantity = "";
            }
        }

        const [addData, setAddData] = useState(new addDataTemplate());
        const [sortKey, setSortKey] = useState("name");
        const [listList, setListList] = useState([]);
        const [listsById, setListsById] = useState([]);
        const [listRows, setListRows] = useState([]);
        const addListForm = useRef();
        const listRowsRef = useRef(listRows);
        const listsRef = useRef(listList);
        listRowsRef.current = listRows;
        listRowsRef.current = listList;

        class editListDataTemplate {
            constructor() {
                this.id = null;

                this.name = null;
                this.items = [];
                this.index = null;
            }
        }

        const [editedList, setEditedList] = useState(new editListDataTemplate());
        const editedListRef = useRef(editedList);
        editedListRef.current = editedList;

        const getLists = (callback, getLocations = false) => {
            setEditedList(new editListDataTemplate());
            fetchJson("./php/lists/getAllLists.php", {
                method: "GET"
            }, x => setListList(x?.lists || []));
        }

        useEffect(() => {
            //trigger hover effect
            document.querySelectorAll(`.td-listId-${editedList.id}`).forEach((x) => {
                x.classList.add("hover")
            })
        }, [listRows, editedList]);

        useEffect(() => {
            setListRows(makeListRows(listList))
        }, [listList]);


        const makeListRows = (lists = listList || [], editListIndex = editedList.index === 0 ? 0 : editedList.index || -1) => {
            const newListRows = [];
            lists.forEach((x, i) => {
                const cellTemplate = {cellData: {"data-listid": x.id}, className: `td-listId-${x.id}`};
                if (i !== editListIndex) {
                    x.items.forEach((y, j) => {
                        newListRows.push((j === 0 ? [
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
                                text: `${y.quantity} ${y.unit}`
                            }]).concat(j === 0 && editListIndex === -1 ? [{
                            ...cellTemplate,
                            type: "button",
                            text: "Edit",
                            buttonClass: "btn-warning",
                            rowspan: x.items.length,
                            className: "text-center " + cellTemplate.className,
                            handler: () => {
                                setEditedList({...x, index: i});
                                setListRows(makeListRows(listList, i));
                            }
                        }, {
                            ...cellTemplate,
                            type: "button",
                            text: "Delete",
                            buttonClass: "btn-danger",
                            rowspan: x.items.length,
                            className: "text-center " + cellTemplate.className,
                            handler: () => {
                                deleteList(x.id);
                            }
                        }] : j === 0 ? [{...cellTemplate, text: "", rowspan: x.items.length, colspan: 2}] : null));
                    })
                } else {
                    newListRows.push(...makeEditRow(x, i))
                }
            })
            return newListRows;
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

        const makeEditRow = (currentList, listIndex) => {
            const cellTemplate = {
                cellData: {"data-listid": currentList.id},
                className: `td-listId-${currentList.id}`,
                cellAlignClass: "align-top"
            };
            const newEditRow = [];
            const firstRow = [
                {...cellTemplate, text: currentList.id, rowspan: currentList.items?.length + 1 || 1},
                {
                    ...cellTemplate,
                    rowspan: currentList.items?.length + 1 || 1,
                    type: "input",
                    props: {
                        type: "text",
                        label: "Name",
                        id: `input-listId-${currentList.id}-name`,
                        defaultValue: currentList.name,
                        onChange: (e, v) => {
                            setEditedList(prevState => {
                                return {...prevState, name: v}
                            });
                        }
                    }
                }];
            currentList.items.forEach((y, i) => {
                    newEditRow.push((i === 0 ? firstRow : []).concat(
                            makeInputCells(currentList, y, i, cellTemplate, listIndex)
                        )
                    )
                }
            )
            newEditRow.push([{
                ...cellTemplate,
                type: "button",
                text: "Add item",
                buttonClass: "btn-primary",
                className: cellTemplate.className,
                handler: () => {
                    const newItems = [...currentList.items];
                    newItems.push({
                        itemId: null,
                        itemName: null,
                        unit: "units",
                        quantity: null,
                        listItemsId: currentList.id
                    });
                    //save new item in edited list
                    setEditedList((prevState) => {
                        return {...prevState, items: newItems}
                    });
                    setListList((x) => {
                        x[listIndex].items = newItems;
                        return [...x];
                    })
                }
            }, {
                ...cellTemplate,
                colspan: 3,
                fragment: <Fragment>
                    <button className="btn btn-success me-3" onClick={() => editList(editedListRef.current)}>Save</button>
                    <button className="btn btn-danger" onClick={() => getLists()}>Cancel</button>
                </Fragment>,
                className: cellTemplate.className,
            }]);
            return newEditRow;
        }

        const makeInputCells = (x, y, i, cellTemplate = {}, startIndex = 0) => {
            const rowIndex = startIndex + i;
            console.log([{...x.items[i], name: x.items[i].itemName, id: x.items[i].itemId}]);
            return [{
                ...cellTemplate,
                fragment: <FormItem id={`input-listId-${x.id}-itemId-${y.itemId}-name`}
                                    label={"Item"}
                                    invalidFeedback={"You must select an item from the list"}
                                    defaultSelected={[{...x.items[i], name: x.items[i].itemName, id: x.items[i].itemId}]}
                                    filterValues={{key: "id", values: x.items.map(x => x.itemId)}}
                                    onChange={(e) => {
                                        x.items.splice(i, 1, {
                                            ...x.items[i],
                                            itemName: e?.[0]?.name || null,
                                            itemId: e?.[0]?.id || null,
                                            unit: e?.[0]?.unit || null,
                                        })
                                        //update the editedList with new items
                                        setEditedList(prevState => {
                                            return {...prevState, items: x.items}
                                        });
                                        //update the full list so the table is re-rendered
                                        setListList((prevState) => {
                                            prevState[startIndex] = x;
                                            return [...prevState];
                                        })
                                    }}
                />
            }
                , {
                    ...cellTemplate,
                    type: "input",
                    props: {
                        label: "Quantity",
                        type: "Number",
                        id: `input-listId-${x.id}-itemId-${y.itemId}-quantity`,
                        defaultValue: x.items[i]?.quantity || null,
                        onChange: (e, v) => {
                            x.items.splice(i, 1, {
                                ...x.items[i],
                                quantity: v
                            })
                            setEditedList(prevState => {
                                return {...prevState, items: x.items}
                            })
                        }
                    }
                }, {
                    ...cellTemplate,
                    className: "align-middle " + cellTemplate.className,
                    text: x.items[i]?.unit || "units"
                },
                x.items.length > 1 ? {
                    ...cellTemplate,
                    type: "button",
                    text: "Delete",
                    buttonClass: "btn-danger",
                    className: "align-middle " + cellTemplate.className,
                    handler: () => {
                        const newDeleteItems = [...listList[startIndex].items];
                        newDeleteItems.splice(i, 1);
                        setEditedList((prevState) => {
                            return {...prevState, items: newDeleteItems}
                        })
                        setListList((x) => {
                            x[startIndex].items = newDeleteItems;
                            return [...x];
                        })
                    }
                } : ""
            ]
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
                        <div className="col-12 col-md-3 mb-3 mb-md-0">
                                <FormInput type={"text"}
                                           id={"inputAddListName"}
                                           label={"Name"}
                                           invalidFeedback={"You must name your list"}
                                           forceCase={"title"}
                                           value={addData.name}
                                           onChange={(e, x) => {
                                               setAddData({...addData, name: x})
                                           }}/>
                        </div>
                        <div className="col-12 col-md-3 mb-3 mb-md-0">
                                <FormItem id={"inputAddListItem"}
                                          label={"Item"}
                                          invalidFeedback={"You must select an item from the list"}
                                          onChange={(e) => {
                                              setAddData({...addData, itemId: e[0]?.id || null, unit: e[0]?.unit || null})
                                          }}
                                />
                        </div>
                        <div className="col-12 col-md-2 mb-3 mb-md-0">
                                <FormInput type={"number"}
                                           id={"inputAddListItemQuantity"}
                                           label={"Quantity"}
                                           invalidFeedback={"You must enter an item quantity"}
                                           min={0}
                                           value={addData.quantity}
                                           onChange={(e, x) => {
                                               setAddData({...addData, quantity: x})
                                           }}/>
                        </div>
                        <div className="col-12 col-md-2 d-flex align-items-center">
                            {addData.unit}
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