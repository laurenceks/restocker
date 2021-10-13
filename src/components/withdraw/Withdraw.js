import PropTypes from 'prop-types';
import FormInput from "../common/forms/FormInput";
import {useEffect, useRef, useState} from "react"

import {dummyItems, dummyLists} from "../common/dummyData";
import InputCheckbox from "../common/forms/InputCheckbox";
import fetchAllItems from "../../functions/fetchAllItems";
import validateForm from "../../functions/formValidation";
import fetchJson from "../../functions/fetchJson";

const Withdraw = ({formType}) => {
    const [withdrawData, setWithdrawData] = useState({});
    const [withdrawType, setWithdrawType] = useState("inputWithdrawTypeItem");
    const [maxQty, setMaxQty] = useState(null);
    const [itemList, setItemList] = useState([]);

    const withdrawFormRef = useRef();

    const getItems = () => {
        fetchAllItems(processItems)
    }

    const processItems = (x) => {
        setItemList(x.items);
    }

    const withdrawItems = (e) => {
        fetchJson("./php/items/addTransaction.php", {
            method: "POST",
            body: JSON.stringify(withdrawData),
        }, (x) => {
            console.log(withdrawFormRef);
            withdrawFormRef.current.reset();
            getItems();
        });
    }
    const withdrawList = (e) => {
        console.log("Withdraw list")
    }

    useEffect(() => {
        getItems();
    }, []);


    return (
        <div className="container">
            <div className={"row align-items-center"}>
                <h1>Withdraw stock</h1>
            </div>
            <form ref={withdrawFormRef} onSubmit={(e) => {
                validateForm(e, withdrawFormRef, withdrawType === "inputWithdrawTypeItem" ? withdrawItems : withdrawList);
            }}>
                <div className="row align-items-center">
                    <div className={"col-12 col-md-5 mb-3"}>
                        <div className={"row align-items-center"}>
                            <h5>Type</h5>
                        </div>
                        <div className={"row align-items-center bg-light rounded p-2"}>
                            <div
                                className={`col-6 ${withdrawType === "inputWithdrawTypeItem" && "bg-primary rounded text-light"}`}>
                                <InputCheckbox className="my-3" type="radio"
                                               name="inputWithdrawType"
                                               id="inputWithdrawTypeItem"
                                               label="Item"
                                               onChange={(id, e) => {
                                                   setWithdrawType(id)
                                               }}
                                               defaultChecked={withdrawType === "inputWithdrawTypeItem"}
                                />
                            </div>
                            <div
                                className={`col-6 ${withdrawType === "inputWithdrawTypeList" && "bg-primary rounded text-light"}`}>
                                <InputCheckbox className="my-3" type="radio"
                                               name="inputWithdrawType"
                                               id="inputWithdrawTypeList"
                                               label="List"
                                               onChange={(id, e) => {
                                                   setWithdrawType(id)
                                               }}/>
                            </div>
                        </div>
                    </div>
                    <div className={"col"}>
                        <div className={"row align-items-center"}>
                            <h5>{withdrawType === "inputWithdrawTypeItem" ? "Item" : "List"}</h5>
                        </div>
                        <div className={"row align-items-center"}>
                            <div className="col-12 col-md-2 mb-3">
                                <p className="m-0">ID {withdrawData.id}</p>
                            </div>
                            <div className="col-12 col-md-5 mb-3">
                                <FormInput
                                    type={"typeahead"} id={"inputWithdrawName"}
                                    typeaheadProps={{
                                        inputProps:
                                            {
                                                id: "inputRegisterOrganisation",
                                                useFloatingLabel: true,
                                                floatingLabelText: "Item",
                                                "data-statename": "Item"
                                            },
                                        onChange: (e) => {
                                            setWithdrawData(e[0] ? {
                                                ...withdrawData,
                                                name: e[0].name,
                                                id: e[0].id
                                            } : {});
                                            setMaxQty(e[0]?.currentStock || null);
                                        },
                                        labelKey: withdrawType === "inputWithdrawTypeItem" ? "name" : "listName",
                                        options: withdrawType === "inputWithdrawTypeItem" ? itemList : dummyLists
                                    }}/>
                            </div>
                            <div className="col-md-5 mb-3">
                                <FormInput type={"number"}
                                           id={"inputWithdrawQuantity"}
                                           label={"Quantity"}
                                           min={0}
                                           max={Math.max(0, maxQty)}
                                           onChange={(id, val) => {
                                               setWithdrawData({
                                                   ...withdrawData,
                                                   quantity: Math.max(Math.min(maxQty, val), 0) * (formType === "withdraw" ? -1 : 1)
                                               });
                                           }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-12 col-sm-2">
                        <button type="submit" className="btn btn-primary w-100">Withdraw</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

Withdraw.propTypes = {
    formType: PropTypes.string
};

Withdraw.defaultProps = {
    formType: "withdraw"
}

export default Withdraw;
