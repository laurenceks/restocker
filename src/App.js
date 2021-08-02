import React, {createContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Route, Switch, Redirect, useLocation} from "react-router-dom";
import Main from "./components/Main";
import NotAuthorised from "./components/NotAuthorised";

const globalAppVars = {};
export const GlobalAppContext = createContext();

function App() {
    fetch("./php/checkUserLogin.php", {
        method: "GET",
    }).then((x) => {
        x.json().then((x) => {
            globalAppVars.isLoggedIn = x;
        })
    });

    return (
        <GlobalAppContext.Provider value={globalAppVars}>
            <div className={"App"}>
                {globalAppVars.isLoggedIn ?
                    <Main/>
                    :
                    <NotAuthorised/>}
            </div>
        </GlobalAppContext.Provider>
    )
}

export default App;
