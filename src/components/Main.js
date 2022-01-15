import {useContext, useState} from 'react';
import {GlobalAppContext} from "../App";
import TopNav from "./TopNav";
import {Redirect, Route, Switch} from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import TransactionForm from "./transactions/TransactionForm";
import Stock from "./stock/Stock";
import Profile from "./profile/Profile";
import AcknowledgeModal from "./Bootstrap/AcknowledgeModal";
import ToastStack from "./Bootstrap/ToastStack";
import ConfirmModal from "./Bootstrap/ConfirmModal";
import EditEntries from "./editEntries/EditEntries";
import Users from "./users/Users";
import ProtectedRoute from "./common/ProtectedRoute";

const Main = props => {
    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);
    const [acknowledgeModalOptions, setAcknowledgeModalOptions] = useState({show: false});
    const [confirmModalOptions, setConfirmModalOptions] = useState({});
    const [toasts, setToasts] = useState([]);

    globalAppContext.setStateFunctions = {
        acknowledgeModal: setAcknowledgeModalOptions,
        confirmModal: setConfirmModalOptions,
        toasts: setToasts,
    };

    const logout = () => {
        fetch("./php/login/logout.php", {
            method: "GET",
        }).then((x) => {
            setGlobalAppContext({...globalAppContext, isLoggedIn: false, user: null});
        });
    }

    return (
        <div className="contentContainer w-100">
            <TopNav user={globalAppContext.user}/>
            <div className="main my-5 mx-auto px-1 px-md-0">
                <Switch>
                    <Route path={"/"} exact component={Dashboard}/>
                    <Route path={"/stock"} component={Stock}/>
                    <Route path={"/withdraw"} render={() => <TransactionForm formType={"withdraw"}/>}/>
                    <Route path={"/restock"} render={() => <TransactionForm formType={"restock"}/>}/>
                    <Route path={"/transfer"} render={() => <TransactionForm formType={"transfer"}/>}/>
                    <Route path={"/logout"} render={() => logout()}/>
                    <ProtectedRoute path={"/profile"} component={Profile}/>
                    <ProtectedRoute path={"/items"} render={() => <EditEntries type={"item"}/>}/>
                    <ProtectedRoute path={"/locations"} render={() => <EditEntries type={"location"}/>}/>
                    <ProtectedRoute path={"/lists"} render={() => <EditEntries type={"list"}/>}/>
                    <ProtectedRoute path={"/users"} render={() => <Users userId={globalAppContext.user.id}/>}/>
                    <Redirect to="/"/>
                </Switch>
            </div>
            <AcknowledgeModal {...acknowledgeModalOptions}/>
            <ToastStack toasts={toasts}/>
            <ConfirmModal {...confirmModalOptions}/>
        </div>
    );
};

Main.propTypes = {};

export default Main;
