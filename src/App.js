import React, {createContext, useContext, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Route, Switch, Redirect, useLocation, useHistory} from "react-router-dom";
import Main from "./components/Main";
import NotAuthorised from "./components/NotAuthorised";

export const GlobalAppContext = createContext();

function App() {
    const [globalAppContext, setGlobalAppContext] = useState({loginCheckedOnce: false, isLoggedIn: false});
    const history = useHistory()
    useEffect(() => {
        fetch("./php/login/checkUserLogin.php", {
            method: "GET",
        }).then((x) => {
            x.json().then((x) => {
                setGlobalAppContext({...globalAppContext, loginCheckedOnce: true, isLoggedIn: x});
            })
        });
    }, []);

    return (
        <GlobalAppContext.Provider value={[globalAppContext, setGlobalAppContext]}>
            <div className={"App"}>
                {(globalAppContext.loginCheckedOnce && globalAppContext.isLoggedIn) ?
                    < Main/> : globalAppContext.loginCheckedOnce && <NotAuthorised/>}
            </div>
        </GlobalAppContext.Provider>
    )
}

export default App;
