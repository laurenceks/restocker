import React, {useContext, useEffect, useState} from 'react';
import {GlobalAppContext} from "../App";
import TopNav from "./TopNav";
import {Route, Switch} from "react-router-dom";
import Users from "./users/Users";
import Dashboard from "./dashboard/Dashboard";
import TransactionForm from "./transactions/TransactionForm";
import Items from "./items/Items";
import Stock from "./stock/Stock";
import Profile from "./profile/Profile";
import Lists from "./lists/Lists";
import AcknowledgeModal from "./Bootstrap/AcknowledgeModal";
import Locations from "./locations/Locations";
import ToastStack from "./Bootstrap/ToastStack";
import ConfirmModal from "./Bootstrap/ConfirmModal";
import {variantPairings} from "./common/styles";

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

    const logout = (e) => {
        fetch("./php/login/tempLogout.php", {
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
                    }}/>
                    <Route path={"/"} exact>
                        <Dashboard/>
                    </Route>
                    <Route path={"/stock"}>
                        <Stock/>
                    </Route>
                    <Route path={"/withdraw"}>
                        <TransactionForm formType={"withdraw"}/>
                    </Route>
                    <Route path={"/restock"}>
                        <TransactionForm formType={"restock"}/>
                    </Route>
                    <Route path={"/transfer"}>
                        <TransactionForm formType={"transfer"}/>
                    </Route>
                    <Route path={"/items"}>
                        <Items/>
                    </Route>
                    <Route path={"/lists"}>
                        <Lists/>
                    </Route>
                    <Route path={"/locations"}>
                        <Locations/>
                    </Route>
                    <Route path={"/profile"}>
                        <Profile/>
                    </Route>
                    <Route path={"/logout"} render={logout}/>
                    <Route path={"/users"}>
                        <Users userId={globalAppContext.user.id}/>
                    </Route>
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
