import {useContext, useEffect, useRef, useState} from "react"
import useFetch from "../../hooks/useFetch";
import FormInput from "../common/forms/FormInput";
import Table from "../common/tables/Table";
import validateForm from "../../functions/formValidation";
import {GlobalAppContext} from "../../App";
import useInitialise from "../../hooks/useInitialise";

const Locations = () => {
        const addDataTemplate = {
            name: ""
        }

        const [addLocationData, setAddLocationData] = useState({...addDataTemplate});
        const [editId, setEditId] = useState(null);
        const [locationList, setLocationList] = useState([]);
        const setModalOptions = useContext(GlobalAppContext)[0].setStateFunctions.confirmModal;
        const fetchHook = useFetch();
        const locationsLoadedOnce = useRef(false);
        const addLocationForm = useRef();

        const getLocations = () => {
            setEditId(null);
            fetchHook({
                type: "getLocations",
                dontHandleFeedback: !locationsLoadedOnce.current,
                callback: (result) => {
                    locationsLoadedOnce.current = true;
                    setLocationList(result.locations)
                }
            });
        }

        const makeLocationRows = () => {
            return locationList.map(location => {
                    return (
                        location.id !== editId ? [
                            location.id,
                            location.name,
                            !editId ? {
                                type: "button",
                                id: 1,
                                text: "Edit",
                                buttonClass: "btn-warning btn-sm",
                                handler: () => {
                                    setEditId(location.id)
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
                                            deleteId: location.id,
                                            targetName: location.name,
                                            bodyText: `Are you sure you want to delete ${location.name}?\n\n${location.currentStock ? `There ${location.currentStock > 1 ? "are" : "is"} currently ${location.currentStock || 0} item${location.currentStock === 1 ? "" : "s"} at ${location.name} and you will not be able to alter stock once the location is deleted.` : "This location does not currently have any stock."}`,
                                            handleNo: () => {
                                                setModalOptions(prevState => {
                                                    return {...prevState, show: false}
                                                })
                                            },
                                            handleYes: () => deleteLocation(location.id, location.name)
                                        }
                                    })
                                }
                            } : {text: ""}
                        ] : makeLocationEditRow(location)
                    )
                }
            )
        }

        const makeLocationEditRow = (location) => {
            const inputIds = {
                name: `editLocationRow-${editId}-name`,
                unit: `editLocationRow-${editId}-unit`,
                warningLevel: `editLocationRow-${editId}-warningLevel`
            };
            return [
                location.id,
                {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.name,
                        label: "Location name",
                        defaultValue: location.name,
                        form: "editLocationForm",
                        forceCase: "title"
                    },
                    invalidFeedback: "You must specify a name"
                }, {
                    type: "submit",
                    buttonClass: "btn-success",
                    text: "Save",
                    id: location.id,
                    className: "text-center buttonCell",
                    form: "editLocationForm",
                    handler: (e) => {
                        validateForm(e, [inputIds.name], (x) => {
                            if (x.isValid) {
                                editLocation({
                                    name: x.values[inputIds.name],
                                    id: location.id
                                })
                            }
                        })
                    }
                }, {
                    type: "button",
                    buttonClass: "btn-danger",
                    text: "Cancel",
                    id: location.id,
                    className: "text-center buttonCell",
                    handler: getLocations
                }]
        }

        const addLocation = (form) => {
            fetchHook({
                type: "addLocation",
                options: {
                    method: "POST",
                    body: JSON.stringify(form.values)
                }
                , callback: () => {
                    setAddLocationData({...addDataTemplate});
                    getLocations();
                }
            });
        }

        const deleteLocation = (id, name) => {
            fetchHook({
                type: "deleteLocation",
                options: {
                    method: "POST",
                    body: JSON.stringify({id: id, name: name}),
                }, callback: (response) => {
                    setModalOptions(prevState => {
                        return {...prevState, show: false}
                    })
                    getLocations()
                }
            });
        }

        const editLocation = (form) => {
            fetchHook({
                type: "editLocation",
                options: {
                    method: "POST",
                    body: JSON.stringify(form),
                }, callback: (response) => {
                    if (response.success || response.errorType !== "locationExists") {
                        getLocations();
                    }
                }
            });
        }

        useInitialise(() => {
            getLocations();
        });

        useEffect(() => {
            makeLocationRows();
        }, [editId]);

        return (
            <div className="container">
                <form ref={addLocationForm} onSubmit={(e) => {
                    validateForm(e, addLocationForm, addLocation);
                }}>
                    <div className="row my-3">
                        <h2>Add new location</h2>
                        <div className="col-12 col-md-4 mb-3 mb-md-0">
                            <div className="formInputGroup">
                                <FormInput type={"text"}
                                           id={"inputAddLocationName"}
                                           label={"Name"}
                                           invalidFeedback={"You must name your location"}
                                           forceCase={"title"}
                                           value={addLocationData.name}
                                           onChange={(e, x) => {
                                               setAddLocationData(prevState => {
                                                   return {...prevState, name: x}
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
                    <h2>All locations</h2>
                    <Table
                        headers={["ID", {text: "Name", colspan: 3}]}
                        rows={makeLocationRows(locationList)}
                        defaultSortIndex={1}
                    />
                </div>
            </div>
        );
    }
;

export default Locations;