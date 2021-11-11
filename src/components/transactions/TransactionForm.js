import PropTypes from 'prop-types';
import FormInput from "../common/forms/FormInput";
import {useEffect, useRef, useState} from "react"

import {mockLists} from "../common/mockData";
import fetchAllItems from "../../functions/fetchAllItems";
import validateForm from "../../functions/formValidation";
import fetchJson from "../../functions/fetchJson";
import naturalSort from "../../functions/naturalSort";
import deepmerge from "deepmerge";

const TransactionForm = ({formType}) => {

    //initialise location list before template class
    const [locationList, setLocationList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [itemData, setItemData] = useState({});
    const [listList, setlistList] = useState(mockLists);
    const [submitted, setSubmitted] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    class transactionDataTemplate {
        constructor(type = "item", selectedLocation = []) {
            this.withdrawType = type;
            this.itemId = null;
            this.name = "";
            this.selectedItem = itemList.length <= 1 ? itemList : [];
            this.selectedLocation = locationList.length <= 1 ? locationList : selectedLocation;
            this.selectedList = listList.length <= 1 ? listList : [];
            this.quantity = 0;
            this.displayQuantity = "";
            this.unit = "";
            this.locationId = (locationList?.length <= 1 ? locationList[0]?.id : selectedLocation[0]?.id) || null;
        }
    }

    const [withdrawItemType, setWithdrawItemType] = useState("item");
    const [transactionData, setTransactionData] = useState(new transactionDataTemplate());
    const [maxQty, setMaxQty] = useState(null);

    const transactionFormRef = useRef();


    const getItems = () => {
        fetchAllItems(processItems, true)
    }

    const processItems = (x) => {
        setLocationList(x.locations);
        setItemData({itemsByLocationId: x.itemsByLocationId, itemsByLocationThenItemId: x.itemsByLocationThenItemId});
        updateOptions({fetchedData: x});
    }

    const updateOptions = (newData = {}) => {
        //provide empty array if no location/item
        newData = {
            location: newData.location || transactionData.selectedLocation || [],
            item: newData.item || transactionData.selectedItem || []
        };
        const newOptions = {
            locationId: newData.location?.[0]?.id || transactionData.locationId,
            selectedLocation: newData.location || transactionData.selectedLocation,
            itemId: newData.item?.length === 0 ? null : newData.item?.[0]?.id || transactionData.itemId,
            name: newData.item?.[0]?.name || transactionData.name,
            unit: newData.item?.[0]?.unit || transactionData.unit,
            displayQuantity: transactionData.displayQuantity
        };
        //set item list to all if restock form, items at a location for a given location ID, or revert to blank array if no items in stock at location
        const newItemList = (newData.fetchedData?.itemsByLocationId || itemData.itemsByLocationId)?.[formType === "restock" ? "all" : newOptions.locationId] || [];
        setItemList(newItemList);
        if (formType !== "restock") {
            //check if itemId is still in current list of items for location
            newOptions.selectedItem = (newData.fetchedData || itemData)?.itemsByLocationThenItemId?.[newOptions.locationId]?.[newOptions.itemId];
            newOptions.selectedItem = newOptions.selectedItem ? newOptions.selectedItem = [newOptions.selectedItem] : [];
        } else {
            //otherwise if restocking just let it be the selection
            newOptions.selectedItem = newData.item || transactionData.selectedItem;
        }
        //if restocking clear maxQty, otherwise set it to currently selected item max or null
        const newMaxQty = formType === "restock" ? null : newOptions.selectedItem?.[0]?.currentStock || null;
        //set the new display quantity to the current value, or the newMaxQty if lower
        const newDisplayQty = formType === "restock" ? newOptions.displayQuantity : Math.min(newOptions.displayQuantity, newMaxQty);
        //make current quantity into right polarisation
        newOptions.quantity = newDisplayQty * (formType === "restock" ? 1 : -1);
        newOptions.displayQuantity = newDisplayQty;
        setTransactionData({...transactionData, ...newOptions})
        setMaxQty(newMaxQty);
    }

    const withdrawItems = (e) => {
        //disable form submission until complete
        setSubmitDisabled(true);
        fetchJson("./php/items/addTransaction.php", {
            method: "POST",
            body: JSON.stringify(transactionData),
        }, (x) => {
            setSubmitted(true);
            setTransactionData(new transactionDataTemplate(withdrawItemType));
        });
    }

    const withdrawList = (e) => {
        console.log("Withdraw list")
    }

    useEffect(() => {
        //disable submission until item list updated
        setSubmitDisabled(true);
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
        if (transactionData.submitted) {
            setSubmitted(false);
            getItems();
        }
    }, [transactionData]);


    return (
        <div className="container">
            <form ref={transactionFormRef}
                  id={"withdrawForm"}
                  onSubmit={(e) => {
                      validateForm(e, transactionFormRef, withdrawItemType === "item" ? withdrawItems : withdrawList);
                  }}>
                <div className={"row align-items-center"}>
                    <h1>{formType === "withdraw" ? `Withdraw ${withdrawItemType}` : "Restock item"}</h1>
                </div>
                {formType === "withdraw" &&
                <div className="row align-items-center mb-3">
                    <div className="col-12 col-md-1 mb-3 mb-md-0">
                        <h5 className="d-inline-block ">Type</h5>
                    </div>
                    <div className="col-12 col-md-11">
                        <div className="btn-group" role="group" aria-label="Withdraw list type">
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1"
                                   autoComplete="off" checked/>
                            <label className="btn btn-outline-primary" htmlFor="btnradio1">List</label>
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2"
                                   autoComplete="off"/>
                            <label className="btn btn-outline-primary" htmlFor="btnradio2">item</label>
                        </div>
                    </div>
                </div>
                }
                <div className={"row align-items-center"}>
                    <h5>{withdrawItemType === "item" ? "Item" : "List"}</h5>
                </div>
                <div className={"row align-items-center"}>
                    <div className="col-12 col-md-1 mb-3">
                        <p className="m-0">ID {transactionData.id}</p>
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <FormInput
                            type={"typeahead"}
                            id={"inputWithdrawName"}
                            typeaheadProps={{
                                inputProps:
                                    {
                                        id: "inputWithdrawName",
                                        useFloatingLabel: true,
                                        floatingLabelText: "Item",
                                        "data-statename": "Item",
                                        disabled: (withdrawItemType === "item" ? itemList : listList).length <= 1
                                    },
                                onChange: (e) => {
                                    updateOptions({item: e});
                                },
                                labelKey: "name",
                                options: itemList,
                                selected: transactionData.selectedItem
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                        <div className="row align-items-center">
                            <div className="col-8"><FormInput type={"number"}
                                                              id={"inputWithdrawQuantity"}
                                                              label={"Quantity"}
                                                              min={0}
                                                              max={maxQty ? Math.max(0, maxQty) : null}
                                                              onChange={(id, val) => {
                                                                  const qty = maxQty ? Math.max(Math.min(maxQty, val), 0) * (formType === "withdraw" ? -1 : 1) : Math.max(val, 0) * (formType === "withdraw" ? -1 : 1);
                                                                  setTransactionData({
                                                                      ...transactionData,
                                                                      displayQuantity: Math.abs(qty),
                                                                      quantity: qty
                                                                  });
                                                              }}
                                                              value={transactionData.displayQuantity}
                                                              disabled={(transactionData.selectedItem.length === 0 || !transactionData.selectedItem) && formType !== "restock"}
                            /></div>
                            <div className="col-4"><p className="m-0">{transactionData.unit}</p></div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <FormInput
                            type={"typeahead"}
                            id={"inputWithdrawLocation"}
                            typeaheadProps={{
                                inputProps:
                                    {
                                        id: "inputWithdrawLocation",
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
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-12 col-sm-2">
                        <button type="submit"
                                className="btn btn-primary w-100"
                                disabled={submitDisabled}
                        >
                            {formType.charAt(0).toUpperCase() + formType.slice(1, formType.length)}
                        </button>
                    </div>
                </div>
            </form>
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
