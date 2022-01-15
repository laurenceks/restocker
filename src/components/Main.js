import {useContext, useState} from 'react';
import {GlobalAppContext} from "../App";
import TopNav from "./nav/TopNav";
import {Navigate, Route, Routes} from "react-router-dom";
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
import Logout from "./login/Logout";

const Main = props => {
    const [globalAppContext] = useContext(GlobalAppContext);
    const [acknowledgeModalOptions, setAcknowledgeModalOptions] = useState({show: false});
    const [confirmModalOptions, setConfirmModalOptions] = useState({});
    const [toasts, setToasts] = useState([]);

    globalAppContext.setStateFunctions = {
        acknowledgeModal: setAcknowledgeModalOptions,
        confirmModal: setConfirmModalOptions,
        toasts: setToasts,
    };

    return (
        <div className="contentContainer w-100">
            <TopNav user={globalAppContext.user}/>
            <div className="main my-5 mx-auto px-1 px-md-0">
                <Routes>
                    <Route path="/" exact element={<Dashboard/>}/>
                    <Route path="/stock" element={<Stock/>}/>
                    <Route path="/withdraw" element={<TransactionForm formType={"withdraw"}/>}/>
                    <Route path="/restock" element={<TransactionForm formType={"restock"}/>}/>
                    <Route path="/transfer" element={<TransactionForm formType={"transfer"}/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/items" element={<ProtectedRoute element={<EditEntries type={"item"}/>}/>}/>
                    <Route path="/locations" element={<ProtectedRoute element={<EditEntries type={"location"}/>}/>}/>
                    <Route path="/lists" element={<ProtectedRoute element={<EditEntries type={"list"}/>}/>}/>
                    <Route path="/users" element={<ProtectedRoute element={<Users userId={globalAppContext.user.id}/>}/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </div>
            <AcknowledgeModal {...acknowledgeModalOptions}/>
            <ToastStack toasts={toasts}/>
            <ConfirmModal {...confirmModalOptions}/>
        </div>
    );
};

Main.propTypes = {};

export default Main;
