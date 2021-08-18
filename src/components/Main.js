import React, {useContext} from 'react';
import {GlobalAppContext} from "../App";
import TopNav from "./TopNav";
import {Route, Switch} from "react-router-dom";

const Main = props => {
    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);
    const logout = (e) => {
        fetch("./php/login/tempLogout.php", {
            method: "GET",
        }).then((x) => {
            setGlobalAppContext({...globalAppContext, isLoggedIn: false, user: null});
        });
    }
    return (
        <div>
            <TopNav user={globalAppContext.user}/>
            <h1>Restocker</h1>
            <p>You are logged in as {globalAppContext.user.firstName}, part of {globalAppContext.user.organisation}</p>
            <p>The main app will go here</p>
            <p><a onClick={logout}>Logout</a></p>
            <Switch>
                <Route path={"/logout"} render={logout}/>
            </Switch>
        </div>
    );
};

Main.propTypes = {};

export default Main;
