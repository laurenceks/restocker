import {useContext} from 'react';
import {Redirect, Route} from "react-router-dom";
import {GlobalAppContext} from "../../App";

const ProtectedRoute = props => {
    const globalContext = useContext(GlobalAppContext)[0];
    console.log(globalContext)
    return (globalContext.isLoggedIn && globalContext.loginCheckedOnce && (globalContext.user.admin || globalContext.user.superAdmin) ?
            <Route {...props}/>
            :
            <Redirect to={"/"}/>
    )
};

export default ProtectedRoute;
