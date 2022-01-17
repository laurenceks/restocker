import {useContext, useRef, useState} from "react"
import {GlobalAppContext} from "../../App";
import EditAccountForm from "./accountForms/EditAccountForm";
import EditAccountEmailForm from "./accountForms/EditAccountEmailForm";
import EditAccountPasswordForm from "./accountForms/EditAccountPasswordForm";
import DeleteAccountForm from "./accountForms/DeleteAccountForm";

const Account = () => {

    const [globalAppContext] = useContext(GlobalAppContext);

    return (
        <div className="container">
            <div className={"row align-items-center mb-3"}>
                <h1>{globalAppContext.user.firstName}'s account</h1>
                <p className="m-0">{globalAppContext.user.superAdmin ? "Super admin" : globalAppContext.user.admin ? "Admin" : "User"}</p>
            </div>
            <EditAccountForm/>
            <EditAccountEmailForm/>
            <EditAccountPasswordForm/>
            <DeleteAccountForm/>
        </div>
    );
};

export default Account;
