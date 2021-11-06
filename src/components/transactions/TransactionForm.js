import PropTypes from 'prop-types';
import FormInput from "../common/forms/FormInput";
import {useEffect, useRef, useState} from "react"

import {mockLists} from "../common/mockData";
import fetchAllItems from "../../functions/fetchAllItems";
import validateForm from "../../functions/formValidation";
import fetchJson from "../../functions/fetchJson";
import naturalSort from "../../functions/naturalSort";

const TransactionForm = ({formType}) => {

    //initialise location list before template class
    const [locationList, setLocationList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [listList, setlistList] = useState(mockLists);

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
            this.locationId = (locationList?.length <= 1 ? locationList[0]?.id : selectedLocation[0]?.id) || null
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
        x.items.forEach(x => x.sortKey = x.name);
        setItemList((formType === "withdraw" ? x.items.filter(x => {
            return x.currentStock > 0;
        }) : x.items).sort(naturalSort));
        setLocationList([x.locations[0]]);
    }

    const withdrawItems = (e) => {
        fetchJson("./php/items/addTransaction.php", {
            method: "POST",
            body: JSON.stringify(transactionData),
        }, (x) => {
            setTransactionData(new transactionDataTemplate(withdrawItemType));
            setMaxQty(null);
            getItems();
        });
    }
    const withdrawList = (e) => {
        console.log("Withdraw list")
    }

    useEffect(() => {
        //on initial load fetch item lists
        getItems();
    }, []);

    useEffect(() => {
        //if formtype changes reprocess items
        getItems();
    }, [formType]);

    useEffect(() => {
        //if lists change then check if current option is still available
        const currentList = formType === "withdraw" ? itemList : listList;
        if (transactionData && !currentList.some((x) => {
            return x.id === transactionData?.itemId
        })) {
            //reset transaction data
            setTransactionData(new transactionDataTemplate(withdrawItemType, transactionData.selectedLocation || []));
        }
        getItems();
    }, [itemList, listList]);

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
                                        "data-statename": "Item"
                                    },
                                onChange: (e) => {
                                    console.log(transactionData.selectedLocation)
                                    setTransactionData({
                                        ...transactionData,
                                        name: e[0]?.name || "",
                                        itemId: e[0]?.id || null,
                                        selectedItem: e || [],
                                        displayQuantity: Math.max(Math.abs(transactionData.quantity), Number(maxQty)),
                                        unit: e[0]?.unit || ""
                                    });
                                    setMaxQty(formType === "withdraw" ? e[0]?.currentStock || null : null);
                                },
                                labelKey: "name",
                                options: withdrawItemType === "item" ? itemList : listList,
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
                                    console.log({
                                        ...transactionData,
                                        locationId: e[0]?.id || null,
                                        selectedLocation: e || []
                                    });
                                    setTransactionData({
                                        ...transactionData,
                                        locationId: e[0]?.id || null,
                                        selectedLocation: e || []
                                    });
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
                                className="btn btn-primary w-100">{formType.charAt(0).toUpperCase() + formType.slice(1, formType.length)}</button>
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
