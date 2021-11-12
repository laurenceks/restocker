import PropTypes from 'prop-types';
import FormInput from "../common/forms/FormInput";
import {useEffect, useRef, useState} from "react"
import {mockLists} from "../common/mockData";
import fetchAllItems from "../../functions/fetchAllItems";
import validateForm from "../../functions/formValidation";
import fetchJson from "../../functions/fetchJson";
import naturalSort from "../../functions/naturalSort";
import InputCheckboxGroup from "../common/forms/InputCheckboxGroup";
import Table from "../common/tables/Table";

const TransactionForm = ({formType}) => {
    class transactionDataTemplate {
        constructor(type = "item", selectedLocation = []) {
            this.productType = type;
            this.transactionFormType = formType;
            this.productId = null;
            this.productName = "";
            this.selectedProduct = itemList.length <= 1 ? itemList : [];
            this.selectedLocation = locationList.length <= 1 ? locationList : selectedLocation;
            this.quantity = 0;
            this.displayQuantity = "";
            this.unit = "";
            this.locationId = (locationList?.length <= 1 ? locationList[0]?.id : selectedLocation[0]?.id) || null;
            this.transactionArray = [];
        }
    }

    //initialise location list before template class
    const [locationList, setLocationList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [itemData, setItemData] = useState({});
    const [listList, setlistList] = useState(mockLists);
    const [submitted, setSubmitted] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [productType, setProductType] = useState("item");
    const [transactionData, setTransactionData] = useState(new transactionDataTemplate());
    const [maxQty, setMaxQty] = useState(null);
    const transactionFormRef = useRef();

    const getItems = () => {
        fetchAllItems(processItems, true)
    }

    const processItems = (x) => {
        const newLocationlist = formType === "restock" ? x.locations : x.locations.filter((l) => {
            //if not a restock form, filter out any location without stock
            return x.itemsByLocationId[l.id] && x.itemsByLocationId[l.id].some(y => y.currentStock > 0);
        });
        setLocationList(newLocationlist);
        setItemData({itemsByLocationId: x.itemsByLocationId, itemsByLocationThenItemId: x.itemsByLocationThenItemId});
        //pass updated data, don't change location if valid or reset selection
        updateOptions({
            fetchedData: x,
            location: newLocationlist.some(l => l.id === transactionData.locationId) ? null : []
        });
    }

    const updateOptions = (newData = {}) => {
        //provide empty array if no location/item
        newData = {
            ...newData,
            location: newData.location || transactionData.selectedLocation || [],
            product: newData.product || transactionData.selectedProduct || [],
        };
        const newOptions = {
            locationId: newData.location?.[0]?.id || transactionData.locationId,
            selectedLocation: newData.location || transactionData.selectedLocation,
            productId: newData.product?.length === 0 ? null : newData.product?.[0]?.id || transactionData.productId,
            productName: newData.product?.[0]?.name || transactionData.productName,
            unit: newData.product?.[0]?.unit || transactionData.unit,
            quantity: newData.quantity || transactionData.quantity || 0,
            displayQuantity: newData.displayQuantity || transactionData.displayQuantity || 0,
            transactionFormType: formType
        };
        //set item list to all if restock form, items at a location for a given location ID, or revert to blank array if no items in stock at location
        const newItemData = newData.fetchedData || itemData;
        const newItemList = (newItemData.itemsByLocationId?.[formType === "restock" ? "all" : newOptions.locationId] || []).filter((x) => {
            return formType === "restock" || x.currentStock > 0
        });
        setItemList(newItemList);
        if (formType !== "restock") {
            if (productType === "item") { //check if productId is still in current list of items for location, or if no selection and only one option pick that
                newOptions.selectedProduct = newItemData?.itemsByLocationThenItemId?.[newOptions.locationId]?.[newOptions.productId];
                newOptions.selectedProduct = newOptions.selectedProduct && newOptions.selectedProduct.currentStock > 0 ? newOptions.selectedProduct = [newOptions.selectedProduct] : (newItemList.length === 1 ? newItemList : []);
            } else {
                newOptions.selectedProduct = newData.product || transactionData.selectedProduct || [];
            }
            newOptions.productId = newOptions.selectedProduct?.[0]?.id || null;
        } else {
            //otherwise if restocking just let it be the selection
            newOptions.selectedProduct = newData.product || transactionData.selectedProduct;
        }
        //if restocking clear maxQty, otherwise set it to currently selected item max or null
        const newMaxQty = formType === "restock" ? null : newOptions.selectedProduct?.[0]?.currentStock || 0;
        //set the new display quantity to the current value, or the newMaxQty if lower
        const newDisplayQty = formType === "restock" ? newOptions.displayQuantity : Math.min(newOptions.displayQuantity, newMaxQty);
        newOptions.quantity = newDisplayQty * (formType === "restock" ? 1 : -1);
        newOptions.displayQuantity = newDisplayQty;
        //generate transaction array for API call
        newOptions.transactionArray = productType === "item" ? [{
            itemId: newOptions.productId,
            itemName: newOptions.productName,
            quantity: newOptions.quantity,
            postTransactionQuantity: newOptions.quantity + newItemData?.itemsByLocationThenItemId?.[newOptions.locationId]?.[newOptions.productId]?.currentStock,
            locationId: newOptions.locationId,
            locationName: newOptions.selectedLocation?.[0]?.name,
            type: formType === "transfer" ? "transfer" : newOptions.quantity < 0 ? "withdraw" : "restock"
        }] : (newOptions.selectedProduct?.[0]?.items || []).map((x) => {
            const transactionQty = x.quantity * newOptions.quantity;
            return {
                itemId: x.id,
                itemName: x.name,
                quantity: transactionQty,
                postTransactionQuantity: transactionQty + (newItemData?.itemsByLocationThenItemId?.[newOptions.locationId]?.[newOptions.productId].currentStock || 0),
                locationId: newOptions.locationId,
                locationName: newOptions.selectedLocation?.[0]?.name,
                type: newOptions.quantity < 0 ? "withdraw" : "restock"
            }
        });
        setTransactionData({...transactionData, ...newOptions})
        setMaxQty(newMaxQty);
    }

    const commitTransaction = (e) => {
        //disable form submission until complete
        setSubmitDisabled(true);
        fetchJson("./php/items/addTransaction.php", {
            method: "POST",
            body: JSON.stringify(transactionData),
        }, (x) => {
            setSubmitted(true);
            if (x.success) {
                setTransactionData(new transactionDataTemplate(productType, transactionData.selectedLocation));
            } else if (x.errorTypes.includes("outOfStock")) {
                //handle out of stock error
                console.log(x.feedback);
                console.log(x.outOfStockItems);
                setTransactionData({...transactionData, quantity: null, maxQty: null})
                //TODO modal notifying of out of stock
            } else if (x.errorTypes.includes("missingItems")) {
                //handle out of stock error
                console.log(x.feedback);
                console.log(x.missingItems);
                getItems();
                //TODO modal notifying of missingItems
            }
        });
    }

    const withdrawList = (e) => {
        console.log("Withdraw list")
    }

    useEffect(() => {
        //disable submission until item list updated
        setSubmitDisabled(true);
        //make sure product type is only item if not withdrawing
        if (formType !== "withdraw") {
            setProductType("item")
        }
        //refresh item lists when page changes between form types
        getItems();
    }, [formType]);

    useEffect(() => {
        //disable submission until item list updated
        setSubmitDisabled(true);
        //on initial mount fetch item lists
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
                      validateForm(e, transactionFormRef, productType === "item" ? commitTransaction : withdrawList);
                  }}>
                <div className={"row align-items-center"}>
                    <h1>{formType === "withdraw" ? `Withdraw ${productType}` : "Restock item"}</h1>
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
                        <p className="m-0">ID {transactionData.id}</p>
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
                            <div className="col-8"><FormInput type={"number"}
                                                              id={"inputTransactionQuantity"}
                                                              label={"Quantity"}
                                                              min={0}
                                                              max={maxQty ? Math.max(0, maxQty) : null}
                                                              onChange={(id, val) => {
                                                                  const qty = maxQty ? Math.max(Math.min(maxQty, val), 0) * (formType === "withdraw" ? -1 : 1) : Math.max(val, 0) * (formType === "withdraw" ? -1 : 1);
                                                                  updateOptions({
                                                                      displayQuantity: Math.abs(qty),
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
                        {locationList.length > 0 ?
                            <FormInput
                                type={"typeahead"}
                                id={"inputTransactionLocation"}
                                typeaheadProps={{
                                    inputProps:
                                        {
                                            id: "inputTransactionLocation",
                                            useFloatingLabel: true,
                                            floatingLabelText: "Location",
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
                            :
                            <div className={"alert alert-warning text-dark m-0"}>There are no locations available with
                                any stock</div>}
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-12 col-sm-2">
                        <button type="submit"
                                className="btn btn-primary w-100"
                                disabled={submitDisabled}>
                            {formType.charAt(0).toUpperCase() + formType.slice(1, formType.length)}
                        </button>
                    </div>
                </div>
            </form>
            {(transactionData.transactionArray.length > 0 && transactionData.transactionArray[0].itemName && transactionData.transactionArray[0].quantity && transactionData.transactionArray[0].locationName) ?
                <div className="text-dark bg-light rounded-3 p-3 my-5">
                    <p className="my-3">This will make the following transactions</p>
                    <Table
                        headers={["Item", "Quantity", formType === "withdraw" ? "Remaining stock" : "New stock", formType === "transfer" ? "From" : "Location", formType === "transfer" ? "To" : null]}
                        rows={transactionData.transactionArray.filter(x => x.locationName && x.itemName && x.quantity).map((x) => {
                            return [x.itemName, Math.abs(x.quantity), x.postTransactionQuantity || "0", x.locationName, formType === "transfer" ? x.destinationName : null]
                        })}
                    />
                </div> : ""}
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
