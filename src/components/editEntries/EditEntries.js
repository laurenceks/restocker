import {useContext, useEffect, useRef, useState} from "react"
import React from "react";
import useFetch from "../../hooks/useFetch";
import validateForm from "../../functions/formValidation";
import {GlobalAppContext} from "../../App";
import {addDataForms, addDataTemplates} from "./editEntriesTemplates";
import setCase from "../../functions/setCase";
import {makeRows, makeUndeleteRow} from "./editEntiresFunctions";
import TableSection from "../common/tables/TableSection";

const EditEntries = ({type}) => {
        const addDataTemplate = addDataTemplates[type];
        const AddDataForm = addDataForms[type];
        const fetchHook = useFetch();
        const setModalOptions = useContext(GlobalAppContext)[0].setStateFunctions.confirmModal;
        const [addData, setAddData] = useState({...addDataTemplate});
        const [editId, setEditId] = useState(null);
        const [dataList, setDataList] = useState([]);
        const addForm = useRef();
        const dataLoadedOnce = useRef(false);

        const getEntries = () => {
            setEditId(null);
            fetchHook({
                type: `get${setCase(type, "capitalise")}s`,
                dontHandleFeedback: !dataLoadedOnce.current,
                callback: (result) => {
                    dataLoadedOnce.current = true;
                    setDataList(result.items)
                }
            });
        }
        const addEntry = (form) => {
            fetchHook({
                type: `add${setCase(type, "capitalise")}`,
                options: {
                    method: "POST",
                    body: JSON.stringify(form.values),
                },
                callback: () => {
                    setAddData({...addDataTemplate});
                    getEntries();
                }
            });
        }
        const editEntry = (form) => {
            fetchHook({
                type: `edit${setCase(type, "capitalise")}`,
                options: {
                    method: "POST",
                    body: JSON.stringify(form),
                },
                callback: (response) => {
                    if (response.success || response.errorType !== "itemExists") {
                        getEntries();
                    }
                }
            });
        }

        const deleteEntry = (id, name) => {
            fetchHook({
                type: `delete${setCase(type, "capitalise")}`,
                options: {
                    method: "POST",
                    body: JSON.stringify({id: id, name: name}),
                },
                callback: () => {
                    setModalOptions(prevState => {
                        return {...prevState, show: false}
                    })
                    getEntries();
                }
            });
        }

        const restoreEntry = (id, name) => {
            fetchHook({
                type: `restore${setCase(type, "capitalise")}`,
                options: {
                    method: "POST",
                    body: JSON.stringify({id, name}),
                },
                callback: () => {
                    setModalOptions(prevState => {
                        return {...prevState, show: false}
                    })
                    getEntries();
                }
            });
        }

        const makeEntryRows = (filteredData = dataList) => {
            return makeRows(type, filteredData, editId, {setModalOptions, setEditId, getEntries, editEntry, deleteEntry})
        }
        const makeEntryUndeleteRow = (filteredData = dataList) => {
            return makeUndeleteRow(type, filteredData, {setModalOptions, restoreEntry})
        }

        useEffect(() => {
            getEntries();
        }, []);

        useEffect(() => {
            makeEntryRows();
        }, [editId]);

        return (
            <div className="container">
                <form ref={addForm} onSubmit={(e) => {
                    validateForm(e, addForm, addEntry);
                }}>
                    <div className="row my-3">
                        {React.createElement(AddDataForm, {addData, setAddData})}
                    </div>
                </form>
                <div className="row my-3">
                    <TableSection title={`All ${type}s`}
                                  tableProps={{
                                      headers: ["ID", "Name", "Current stock", {text: "Warning level", colspan: 3}],
                                      rows: makeEntryRows(dataList.filter((x) => !x.deleted)),
                                      defaultSortIndex: 1
                                  }}
                    />
                    <TableSection title={`Deleted ${type}s`}
                                  tableProps={{
                                      headers: ["ID", "Name", "Stock on deletion", {colspan: 2, text: "Deleted"}],
                                      rows: makeEntryUndeleteRow(dataList.filter((x) => x.deleted)),
                                      defaultSortIndex: 1
                                  }}
                    />
                </div>
            </div>
        );
    }
;

export default EditEntries;