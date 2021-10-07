import PropTypes from 'prop-types';
import LoginInput from "../login/loginComponents/LoginInput";
import {useState} from "react"

import {dummyItems, dummyLists} from "../common/dummyData";
import LoginCheckbox from "../login/loginComponents/LoginCheckbox";

const Withdraw = props => {
    const [withdrawData, setWithdrawData] = useState({});
    const [withdrawType, setWithdrawType] = useState("item");
    const [maxQty, setMaxQty] = useState(null);
    return (
        <div className="container">
            <form>
                <div className="row">
                    <h5>Type</h5>
                        <LoginCheckbox className="my-3" type="radio" name="inputWithdrawType" id="inputWithdrawTypeItem" label="Item" onChange={ (id, e) => {setWithdrawType(id)}}/>
                        <LoginCheckbox type="radio" name="inputWithdrawType" id="inputWithdrawTypeList" label="List" onChange={ (id, e) => {setWithdrawType(id)}}/>
                </div>
                <div className="row">
                    <div className="col-1 d-flex justify-content-end align-items-center">
                        <p className="m-0">ID {withdrawData.id}</p>
                    </div>
                    <div className="col">
                        <LoginInput type={"typeahead"} id={"inputWithdrawName"} typeaheadProps={{
                            inputProps:
                                {
                                    id: "inputRegisterOrganisation",
                                    useFloatingLabel: true,
                                    floatingLabelText: "Item",
                                    "data-statename": "Item"
                                },
                            onChange: (e) => {
                                setWithdrawData(e[0] || {});
                                setMaxQty(e[0]?.currentStock || null);
                            },
                            labelKey: withdrawType === "inputWithdrawTypeItem" ? "itemName" : "listName",
                            options: withdrawType === "inputWithdrawTypeItem" ? dummyItems : dummyLists
                        }}/>
                    </div>
                    <div className="col">
                        <LoginInput type={"number"} id={"inputWithdrawQuantity"} label={"Quantity"} max={maxQty}/>
                    </div>
                </div>
            </form>
        </div>
    );
};

Withdraw.propTypes = {};

export default Withdraw;
