import PropTypes from 'prop-types';
import FormInput from "../common/forms/FormInput";
import {useContext, useEffect, useRef, useState} from "react"
import fetchAllItems from "../../functions/fetchAllItems";
import validateForm from "../../functions/formValidation";
import fetchJson from "../../functions/fetchJson";
import naturalSort from "../../functions/naturalSort";
import InputCheckboxGroup from "../common/forms/InputCheckboxGroup";
import Table from "../common/tables/Table";
import setCase from "../../functions/setCase";
import AcknowledgeModal from "../Bootstrap/AcknowledgeModal";
import handleFeedback from "../../functions/handleFeedback";
import {GlobalAppContext} from "../../App";

const TransactionForm = ({formType}) => {
    class transactionDataTemplate {
        constructor(type = "item", selectedLocation = [], selectedDestination = []) {
            this.productType = type;
            this.transactionFormType = formType;
            this.productId = null;
            this.productName = "";
            this.selectedProduct = itemList.length <= 1 ? itemList : [];
            this.selectedLocation = locationList.length <= 1 ? locationList : selectedLocation;
            this.selectedDestination = destinationList.length <= 1 ? destinationList : selectedDestination;
            this.quantity = 0;
            this.displayQuantity = "";
            this.unit = "";
            this.locationId = (locationList?.length <= 1 ? locationList[0]?.id : selectedLocation[0]?.id) || null;
            this.locationName = (locationList?.length <= 1 ? locationList[0]?.name : selectedLocation[0]?.name) || null;
            this.destinationId = (destinationList?.length <= 1 ? destinationList[0]?.id : selectedDestination[0]?.id) || null;
            this.destinationName = (destinationList?.length <= 1 ? destinationList[0]?.name : selectedDestination[0]?.name) || null;
            this.transactionArray = [];
        }
    }

    //initialise location list before template class
    const [locationList, setLocationList] = useState([]);
    const [locationsLoadedOnce, setLocationsLoadedOnce] = useState(false);
    const [destinationList, setDestinationList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [productData, setProductData] = useState({});
    const [listList, setListList] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [productType, setProductType] = useState("item");
    const [transactionData, setTransactionData] = useState(new transactionDataTemplate());
    const [maxQty, setMaxQty] = useState(null);
    const [modalProps, setModalProps] = useState({
        show: false,
        bodyText: "",
        title: "Transaction error",
        headerClass: "bg-danger text-light",
        handleClick: () => {
            setModalProps({...modalProps, show: false})
        }
    });
    const transactionFormRef = useRef();
    const setStateFunctions = useContext(GlobalAppContext)[0].setStateFunctions;

    const getItems = (retainedSettings) => {
        fetchAllItems((x) => {
            processItems(x, retainedSettings)
        }, true)
    }

    const processItems = (x, retainedSettings = {}) => {
        const newLocationList = filterLocationList(x.locations, x.itemsByLocationId, x.listsByLocationId, retainedSettings?.productTypeChange);
        setLocationsLoadedOnce(true);
        setDestinationList(x.locations);
        setProductData({
            itemsByLocationId: x.itemsByLocationId,
            itemsByLocationThenItemId: x.itemsByLocationThenItemId,
            listsByLocationId: x.listsByLocationId,
            listsByLocationThenListId: x.listsByLocationThenListId
        });
        setLocationList(newLocationList);
        //pass updated data, don't change location/destination if valid or reset selection
        updateOptions({
            ...retainedSettings,
            fetchedData: x,
            location: newLocationList.some(l => l.id === transactionData.locationId) ? null : [],
            destination: x?.locations?.some(l => l.id === transactionData.destinationId) ? null : [],
        });
    }

    const filterLocationList = (locations = destinationList || [], itemsByLocationId = productData?.itemsByLocationId || [], listsByLocationId = productData?.listsByLocationId || [], forceItem = false) => {
        return formType === "restock" ? locations : locations.filter((l) => {
            //if not a restock form, filter out any location without stock
            const productReferenceList = (productType === "item" || forceItem) ? itemsByLocationId : listsByLocationId;
            return productReferenceList[l.id] && (productReferenceList[l.id]).some((x) => x.currentStock > 0);
        })
    }

    const updateOptions = (newData = {}) => {
        //provide empty array if no location/item
        newData = {
            ...newData,
            product: newData.product || transactionData.selectedProduct || [],
            location: newData.location || (locationList.length === 1 ? locationList : transactionData.selectedLocation) || [],
            destination: newData.destination || (destinationList.length === 1 ? destinationList : transactionData.selectedDestination) || [],
        };
        const newOptions = {
            locationId: newData.location?.[0]?.id || transactionData.locationId,
            locationName: newData.location?.[0]?.name || transactionData.locationName,
            selectedLocation: newData.location || transactionData.selectedLocation,
            destinationId: newData.destination?.[0]?.id || transactionData.destinationId,
            destinationName: newData.destination?.[0]?.namer || transactionData.destinationName,
            selectedDestination: newData.destination || transactionData.selectedDestination,
            productId: newData.product?.length === 0 ? null : newData.product?.[0]?.id || transactionData.productId,
            productName: newData.product?.[0]?.name || transactionData.productName,
            unit: newData.product?.[0]?.unit || transactionData.unit,
            quantity: newData.quantity || transactionData.quantity || 0,
            displayQuantity: newData.displayQuantity === "" ? "" : newData.displayQuantity || transactionData.displayQuantity || "",
            transactionFormType: formType
        };
        //set item list to all if restock form, items at a location for a given location ID, or revert to blank array if no items in stock at location
        const newProductData = newData.fetchedData || productData;
        const newItemList = (newProductData.itemsByLocationId?.[formType === "restock" ? "all" : newOptions.locationId] || []).filter((x) => {
            return formType === "restock" || x.currentStock > 0
        });
        const newListList = (newProductData.listsByLocationId?.[formType === "restock" ? "all" : newOptions.locationId] || []).filter((x) => {
            return formType === "restock" || x.currentStock > 0;
        });
        setItemList(newItemList);
        setListList(newListList);
        if (formType !== "restock") {
            if (productType === "item") {
                //check if productId is still in current list of items for location, or if no selection and only one option pick that
                newOptions.selectedProduct = newProductData?.itemsByLocationThenItemId?.[newOptions.locationId]?.[newOptions.productId];
                newOptions.selectedProduct = newOptions.selectedProduct && newOptions.selectedProduct.currentStock > 0 ? newOptions.selectedProduct = [newOptions.selectedProduct] : (newItemList.length === 1 ? newItemList : []);
            } else {
                newOptions.selectedProduct = newProductData?.listsByLocationThenListId?.[newOptions.locationId]?.[newOptions.productId];
                newOptions.selectedProduct = newOptions.selectedProduct && newOptions.selectedProduct.currentStock > 0 ? newOptions.selectedProduct = [newOptions.selectedProduct] : (newListList.length === 1 ? newListList : []);
            }
            newOptions.productId = newOptions.selectedProduct?.[0]?.id || null;
        } else {
            //otherwise if restocking just let it be the selection
            newOptions.selectedProduct = newData.product || transactionData.selectedProduct;
        }
        //if restocking clear maxQty, otherwise set it to currently selected item max or null
        const newMaxQty = formType === "restock" ? null : newOptions.selectedProduct?.[0]?.currentStock || 0;
        //set the new display quantity to the current value, or the newMaxQty if lower
        const newDisplayQty = formType === "restock" ? newOptions.displayQuantity : newOptions.displayQuantity === "" ? "" : Math.min(newOptions.displayQuantity, newMaxQty);
        newOptions.quantity = newDisplayQty * (formType === "restock" ? 1 : -1);
        newOptions.displayQuantity = newDisplayQty;
        //generate transaction array for API call
        newOptions.transactionArray = productType === "item" ? [createTransactionElement(newProductData, newOptions)] : (newOptions.selectedProduct?.[0]?.items || []).map((x) => {
            return createTransactionElement(newProductData, newOptions, x);
        });
        if (formType === "transfer" && newOptions.selectedDestination[0]) {
            newOptions.transactionArray.push(createTransactionElement(newProductData, newOptions, {
                itemId: newOptions.productId,
                quantity: (newOptions.quantity * -1),
                locationId: newOptions.destinationId,
                locationName: newOptions.selectedDestination[0].name,
                isTransfer: true
            }))
        }
        setTransactionData({...transactionData, ...newOptions})
        setMaxQty(newMaxQty);
    }

    const createTransactionElement = (newProductData, newOptions, x) => {
        const transactionQty = x?.isTransfer ? x?.quantity || newOptions.quantity : (x?.quantity || 1) * newOptions.quantity;
        const transactionProductId = x?.itemId || newOptions.productId;
        const postTransactionQuantity = transactionQty + (newProductData?.itemsByLocationThenItemId?.[x?.locationId || newOptions.locationId]?.[transactionProductId]?.currentStock || 0);
        return {
            itemId: transactionProductId,
            itemName: x?.itemName || newOptions.productName,
            quantity: transactionQty,
            postTransactionQuantity: postTransactionQuantity,
            postTransactionQuantityClassName: postTransactionQuantity <= 0 ? "table-danger" : postTransactionQuantity <= newProductData.itemsByLocationThenItemId[newOptions.locationId]?.[transactionProductId]?.warningLevel ? "table-warning" : null,
            locationId: x?.locationId || newOptions.locationId,
            locationName: x?.locationName || newOptions.selectedLocation?.[0]?.name,
            type: transactionQty < 0 ? "withdraw" : "restock",
            isTransfer: x?.isTransfer || false
        }
    }

    const commitTransaction = (e) => {
        //disable form submission until complete
        setSubmitDisabled(true);
        fetchJson("./php/items/addTransaction.php", {
            method: "POST",
            body: JSON.stringify(transactionData),
        }, (x) => {
            setSubmitted(true);
            handleFeedback(setStateFunctions, x, );
            if (x.success) {
                setTransactionData(new transactionDataTemplate(productType, transactionData.selectedLocation, transactionData.selectedDestination));
            } else {
                setTransactionData({...transactionData, quantity: null, maxQty: null})
                getItems();
            }
        });
    }

    useEffect(() => {
        const productTypeChange = productType === "list";
        //disable submission until item list updated
        setSubmitDisabled(true);
        //make sure product type is only item if not withdrawing
        if (formType !== "withdraw" && productTypeChange) {
            setProductType("item");
        }
        //refresh item lists when page changes between form types, making sure blank product is passed if product type changes
        getItems(productTypeChange ? {product: [], productTypeChange} : null);
    }, [formType]);

    useEffect(() => {
        //if product type changes, re-filter locations
        const updatedLocationList = filterLocationList();
        const passedData = {product: []};
        //check current location is still valid, if not remove it
        if (updatedLocationList.length === 1) {
            passedData.location = updatedLocationList;
        } else if (updatedLocationList.length === 0 || (transactionData?.locationId && !updatedLocationList?.some(x => x.id === transactionData?.locationId))) {
            passedData.location = [];
        }
        setLocationList(updatedLocationList);
        //clear product input field
        updateOptions(passedData);
    }, [productType]);

    useEffect(() => {
        //disable submission until item list updated
        setSubmitDisabled(true);
        //on initial render fetch item lists
        getItems();
    }, []);

    useEffect(() => {
        //enable submit button, as fields validated once state set
        setSubmitDisabled(false);
        //if transaction data has been submitted, refresh item list
        if (submitted) {
            setSubmitted(false);
            getItems();
        }
    }, [transactionData]);

    return (
        <div className="container">
            <form ref={transactionFormRef}
                  id={"transactionForm"}
                  onSubmit={(e) => {
                      validateForm(e, transactionFormRef, commitTransaction);
                  }}>
                <div className={"row align-items-center"}>
                    <h1>{`${setCase(formType, "capitalise")} ${productType}`}</h1>
                </div>
                {formType === "withdraw" &&
                <div className="row align-items-center mb-3">
                    <div className="col-12 col-md-1 mb-3 mb-md-0">
                        <h5 className="d-inline-block ">Type</h5>
                    </div>
                    <div className="col-12 col-md-11">
                        <InputCheckboxGroup
                            boxes={[{label: "Item", value: "item"}, {label: "List", value: "list"}]}
                            type={"radio"}
                            name={"productType"}
                            state={productType}
                            onChange={(e) => {
                                setProductType(e.target.dataset.value)
                            }}/>
                    </div>
                </div>
                }
                <div className={"row align-items-center"}>
                    <h5>{productType === "item" ? "Item" : "List"}</h5>
                </div>
                <div className={"row align-items-center"}>
                    <div className="col-12 col-md-1 mb-3">
                        <p className="m-0">ID {transactionData.productId}</p>
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <FormInput
                            type={"typeahead"}
                            id={"inputTransactionProductName"}
                            typeaheadProps={{
                                inputProps:
                                    {
                                        id: "inputTransactionProductName",
                                        useFloatingLabel: true,
                                        floatingLabelText: productType === "item" ? "Item" : "List",
                                        "data-statename": productType === "item" ? "Item" : "List",
                                        disabled: (productType === "item" ? itemList : listList).length <= 1
                                    },
                                onChange: (e) => {
                                    updateOptions({product: e});
                                },
                                labelKey: "name",
                                options: (productType === "item" ? itemList : listList).sort((a, b) => {
                                    return naturalSort(a.name, b.name)
                                }),
                                selected: transactionData.selectedProduct
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                        <div className="row align-items-center">
                            <div className="col-8">
                                <FormInput type={"number"}
                                           id={"inputTransactionQuantity"}
                                           label={"Quantity"}
                                           min={0}
                                           max={maxQty ? Math.max(0, maxQty) : null}
                                           onChange={(id, val) => {
                                               const qty = maxQty ? Math.max(Math.min(maxQty, val), 0) * (formType === "withdraw" ? -1 : 1) : Math.max(val, 0) * (formType === "withdraw" ? -1 : 1);
                                               updateOptions({
                                                   displayQuantity: !val ? "" : Math.abs(qty),
                                                   quantity: qty
                                               })
                                           }}
                                           value={transactionData.displayQuantity}
                                           disabled={(transactionData.selectedProduct.length === 0 || !transactionData.selectedProduct) && formType !== "restock"}
                                /></div>
                            <div className="col-4"><p className="m-0">{transactionData.unit}</p></div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <FormInput
                            type={"typeahead"}
                            id={"inputTransactionLocation"}
                            typeaheadProps={{
                                inputProps:
                                    {
                                        id: "inputTransactionLocation",
                                        useFloatingLabel: true,
                                        floatingLabelText: formType === "transfer" ? "From" : "Location",
                                        "data-statename": "Location",
                                        disabled: locationList.length <= 1
                                    },
                                onChange: (e) => {
                                    updateOptions({location: e});
                                },
                                labelKey: "name",
                                options: locationList.sort((a, b) => {
                                    return naturalSort(a.name, b.name)
                                }),
                                selected: transactionData.selectedLocation
                            }}
                        />
                    </div>
                </div>
                {formType === "transfer" &&
                <div className={"row"}>
                    <div className="col-12 col-md-8 mb-3 d-none d-md-block">
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <FormInput
                            type={"typeahead"}
                            id={"inputTransactionDestination"}
                            typeaheadProps={{
                                inputProps:
                                    {
                                        id: "inputTransactionDestination",
                                        useFloatingLabel: true,
                                        floatingLabelText: "To",
                                        "data-statename": "Destination",
                                        disabled: destinationList.length <= 1
                                    },
                                onChange: (e) => {
                                    updateOptions({destination: e});
                                },
                                labelKey: "name",
                                options: destinationList.sort((a, b) => {
                                    return naturalSort(a.name, b.name)
                                }),
                                selected: transactionData.selectedDestination
                            }}
                        />
                    </div>
                </div>}
                <div className={"row"}>
                    {!locationsLoadedOnce || (locationList.length > 0 && (destinationList.length > 0 || formType !== "transfer")) ?
                        <div className="col-12 col-sm-2">
                            <button type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={submitDisabled || !locationsLoadedOnce}>
                                {formType.charAt(0).toUpperCase() + formType.slice(1, formType.length)}
                            </button>
                        </div>
                        :
                        <div className={"alert alert-warning text-primary m-0 col-12 col-sm-5"}>
                            There are no
                            {locationList.length === 0 && " locations"}
                            {(locationList.length === 0 && (formType === "transfer" && destinationList.length === 0)) && " or"}
                            {(formType === "transfer" && destinationList.length === 0) && " destinations"} available
                            with any stock</div>}
                </div>
            </form>
            {(transactionData.transactionArray.length > 0 && transactionData.transactionArray?.[0]?.itemName && transactionData.transactionArray?.[0]?.quantity && transactionData.transactionArray?.[0]?.locationName && (formType !== "transfer" || transactionData.transactionArray?.[1]?.locationName)) ?
                <div className="text-dark bg-light rounded-3 p-3 my-5">
                    <p className="my-3">This will make the following transactions</p>
                    <Table
                        headers={formType === "transfer" ? ["Item", "Quantity", "Remaining stock", "New stock", "From", "To"] : ["Item", "Quantity", formType === "withdraw" ? "Remaining stock" : "New stock", "Location"]}
                        rows={formType === "transfer" ?
                            [[transactionData.transactionArray[0].itemName,
                                Math.abs(transactionData.transactionArray[0].quantity),
                                {
                                    text: transactionData.transactionArray[0].postTransactionQuantity || "0",
                                    className: transactionData.transactionArray[0].postTransactionQuantityClassName
                                }, {
                                    text: transactionData.transactionArray[1].postTransactionQuantity || "0",
                                    className: transactionData.transactionArray[1].postTransactionQuantityClassName
                                }, transactionData.transactionArray[0].locationName,
                                transactionData.transactionArray[1].locationName]]
                            :
                            transactionData.transactionArray.filter(x => x.locationName && x.itemName && x.quantity).map((x) => {
                                return [x.itemName,
                                    Math.abs(x.quantity),
                                    {
                                        text: x.postTransactionQuantity || "0",
                                        className: x.postTransactionQuantityClassName
                                    },
                                    x.locationName]
                            })}
                    />
                </div> : ""}
            <AcknowledgeModal {...modalProps} />
        </div>
    )
        ;
};

TransactionForm.propTypes = {
    formType: PropTypes.string
};

TransactionForm.defaultProps = {
    formType: "withdraw"
}

export default TransactionForm;
