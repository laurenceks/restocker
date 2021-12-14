import {Fragment, useEffect, useRef, useState} from "react"
import useFetch from "../../hooks/useFetch";
import FormInput from "../common/forms/FormInput";
import FormItem from "../common/forms/FormItem";
import Table from "../common/tables/Table";
import ConfirmModal from "../Bootstrap/ConfirmModal";
import validateForm from "../../functions/formValidation";
import naturalSort from "../../functions/naturalSort";

const Lists = () => {
    class addDataTemplate {
        constructor() {
            this.name = "";
            this.itemId = null;
            this.itemName = null;
            this.unit = null;
            this.quantity = "";
            this.selected = [];
        }
    }

    class editDataTemplate {
        constructor() {
            this.id = null;
            this.name = null;
            this.items = [];
            this.index = null;
        }
    }

    const fetchHook = useFetch();
    const [addData, setAddData] = useState(new addDataTemplate());
    const [editData, setEditData] = useState(new editDataTemplate());
    const [listList, setListList] = useState([]);
    const [listRows, setListRows] = useState([]);
    const [confirmModalOptions, setConfirmModalOptions] = useState({
        show: false,
        deleteId: null,
        bodyText: "",
        headerClass: "bg-danger text-light",
        yesButtonVariant: "danger"
    });
    const addListForm = useRef();
    const listsLoadedOnce = useRef(false);
    const editedListRef = useRef(editData);
    editedListRef.current = editData;

    const getLists = (callback, getLocations = false) => {
        setEditData(new editDataTemplate());
        fetchHook({
            type: "getLists", dontHandleFeedback: !listsLoadedOnce.current, callback: x => {
                listsLoadedOnce.current = true;
                setListList(x?.lists || [])
            }
        });
    }

    useEffect(() => {
        //trigger hover effect by applying class to 'grouped' rows
        document.querySelectorAll(`.td-listId-${editData.id}`).forEach((x) => {
            x.classList.add("hover")
        })
    }, [listRows, editData]);

    useEffect(() => {
        //update table rows
        setListRows(makeListRows(listList))
    }, [listList]);

    useEffect(() => {
        //get list list
        getLists();
    }, []);

    const makeListRows = (lists = listList || [], editListIndex = editData.index === 0 ? 0 : editData.index || -1) => {
        const newListRows = [];
        lists.forEach((x, i) => {
            const cellTemplate = {cellData: {"data-listid": x.id}, className: `td-listId-${x.id}`};
            if (i !== editListIndex) {
                x.items.sort((a, b) => naturalSort(a.itemName, b.itemName)).forEach((y, j) => {
                    newListRows.push((j === 0 ? [
                        {
                            ...cellTemplate,
                            rowspan: x.items.filter(x => !x.deleted).length,
                            text: x.id
                        },
                        {
                            ...cellTemplate,
                            rowspan: x.items.filter(x => !x.deleted).length,
                            text: x.name,
                        }] : []).concat(
                        [{
                            ...cellTemplate,
                            sortValue: `${x.name}-${y.itemName}`,
                            text: y.itemName
                        }, {
                            ...cellTemplate,
                            sortValue: `${x.name}-${y.quantity} ${y.unit}`,
                            text: `${y.quantity} ${y.unit}`
                        }]).concat(j === 0 && editListIndex === -1 ? [{
                        ...cellTemplate,
                        type: "button",
                        text: "Edit",
                        buttonClass: "btn-warning",
                        rowspan: x.items.filter(x => !x.deleted).length,
                        className: "text-center " + cellTemplate.className,
                        handler: () => {
                            setEditData({...x, index: i});
                            setListRows(makeListRows(listList, i));
                        }
                    }, {
                        ...cellTemplate,
                        type: "button",
                        text: "Delete",
                        buttonClass: "btn-danger",
                        rowspan: x.items.filter(x => !x.deleted).length,
                        className: "text-center " + cellTemplate.className,
                        handler: () => {
                            setConfirmModalOptions(prevState => {
                                return {
                                    ...prevState,
                                    show: true,
                                    deleteId: x.id,
                                    bodyText: `Are you sure you want to delete ${x.name}?`
                                }
                            })
                        }
                    }] : j === 0 ? [{
                        ...cellTemplate,
                        text: "",
                        rowspan: x.items.filter(x => !x.deleted).length,
                        colspan: 2
                    }] : null));
                })
            } else {
                newListRows.push(...makeEditRow(x, i))
            }
        })
        return newListRows;
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
                        setEditData(prevState => {
                            return {...prevState, name: v}
                        });
                    }
                }
            }];
        currentList.items.forEach((y, i) => {
                newEditRow.push((i === 0 ? firstRow : []).concat(
                        y.deleted ? [] : makeInputCells(currentList, y, i, cellTemplate, listIndex)
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
                    itemName: "",
                    unit: "units",
                    quantity: null,
                    listId: currentList.id,
                    listItemsId: null,
                    deleted: 0
                });
                //save new item in edited list
                setEditData((prevState) => {
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
        const sortTemplate = `${x.id}-${i}-`
        return [{
            ...cellTemplate,
            sortValue: `${sortTemplate}${x.items[i].itemName}`,
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
                                    setEditData(prevState => {
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
                sortValue: `${sortTemplate}${x.items[i]?.quantity || 0}`,
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
                        setEditData(prevState => {
                            return {...prevState, items: x.items}
                        })
                    }
                }
            }, {
                ...cellTemplate,
                className: "align-middle " + cellTemplate.className,
                sortValue: `${sortTemplate}${x.items[i]?.unit || "units"}`,
                text: x.items[i]?.unit || "units"
            },
            x.items.filter(x => !x.deleted).length > 1 ? {
                ...cellTemplate,
                type: "button",
                text: "Delete",
                buttonClass: "btn-danger",
                className: "align-middle " + cellTemplate.className,
                handler: () => {
                    const newDeleteItems = [...listList[startIndex].items];
                    newDeleteItems[i] = {...newDeleteItems[i], deleted: 1}
                    setEditData((prevState) => {
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

    const addList = () => {
        fetchHook({
            type: "addList",
            options: {
                method: "POST",
                body: JSON.stringify(addData),
            },
            callback: (response) => {
                if (response.success) {
                    setAddData(new addDataTemplate())
                }
                getLists();
            }
        });
    };

    const deleteList = (id) => {
        fetchHook({
            type: "deleteList",
            options: {
                method: "POST",
                body: JSON.stringify({id: id}),
            },
            callback: (x) => {
                setConfirmModalOptions(prevState => {
                    return {...prevState, show: false}
                })
                getLists();
            }
        });
    };

    const editList = () => {
        fetchHook({
            type: "editList",
            options: {
                method: "POST",
                body: JSON.stringify(editedListRef.current),
            },
            callback: getLists
        });
    }
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
                        <FormItem id={"inputAddListItemId"}
                                  label={"Item"}
                                  invalidFeedback={"You must select an item from the list"}
                                  selected={addData.selected}
                                  onChange={(e) => {
                                      setAddData({
                                          ...addData,
                                          itemId: e[0]?.id || null,
                                          itemName: e[0]?.name || null,
                                          unit: e[0]?.unit || null,
                                          selected: e
                                      })
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
            <ConfirmModal
                {...confirmModalOptions}
                handleNo={() => {
                    setConfirmModalOptions(prevState => {
                        return {...prevState, show: false}
                    });
                }}
                handleYes={() => deleteList(confirmModalOptions.deleteId)}
            />
        </div>
    );
}

export default Lists;