import {useContext} from "react"
import {GlobalAppContext} from "../../App";
import EditAccountForm from "./accountForms/EditAccountForm";
import EditAccountEmailForm from "./accountForms/EditAccountEmailForm";
import EditAccountPasswordForm from "./accountForms/EditAccountPasswordForm";
import DeleteAccountForm from "./accountForms/DeleteAccountForm";
import {Navigate, Route, Routes} from "react-router-dom";
import NavColButton from "../common/NavColButton";

const Account = () => {

    const [globalAppContext] = useContext(GlobalAppContext);

    return (
        <div className="container">
            <div className={"row align-items-center mb-3"}>
                <h1>{globalAppContext.user.firstName}'s account</h1>
                <p className="m-0">{globalAppContext.user.superAdmin ? "Super admin" : globalAppContext.user.admin ? "Admin" : "User"}</p>
            </div>
            <div className="my-3 row">
                <NavColButton to={"/account/profile"} text="Profile" cols={3}/>
                <NavColButton to={"/account/email"} text="Change email" cols={3}/>
                <NavColButton to={"/account/password"} text="Change password" cols={3}/>
                <NavColButton to={"/account/delete"} text="Delete account" cols={3} variant={"danger"}/>
            </div>
            <Routes>
                <Route path={"/profile"} element={<EditAccountForm/>}/>
                <Route path={"/email"} element={<EditAccountEmailForm/>}/>
                <Route path={"/password"} element={<EditAccountPasswordForm/>}/>
                <Route path={"/delete"} element={<DeleteAccountForm/>}/>
                <Route path={"*"} element={<Navigate to={"/account/profile"}/>}/>
            </Routes>
        </div>
    );
};

export default Account;
