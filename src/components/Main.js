import React, {useContext} from 'react';
import {GlobalAppContext} from "../App";
import TopNav from "./TopNav";
import {Route, Switch} from "react-router-dom";
import Users from "./Users/Users";
import Dashboard from "./dashboard/Dashboard";
import Withdraw from "./withdraw/Withdraw";

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
        <div className="contentContainer w-100">
            <TopNav user={globalAppContext.user}/>
            <div className="main my-5 mx-auto">

                <Switch>
                    <Route path={"/"} exact render={() => {
                        return (
                            <div>
                                <h1>Restocker</h1>
                                <Dashboard/>
                            </div>
                        )
                    }}/>
                    <Route path={"/withdraw"}>
                        <Withdraw/>
                    </Route>
                    <Route path={"/logout"} render={logout}/>
                    <Route path={"/users"}>
                        <Users userId={globalAppContext.user.id}/>
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

Main.propTypes = {};

export default Main;
