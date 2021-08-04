import React, {useContext} from 'react';
import {GlobalAppContext} from "../App";

const Main = props => {
    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);
    return (
        <div>
            <h1>Restocker</h1>
            <p>You are logged in.</p>
            <p>The main app will go here</p>
            <p><a onClick={(e) => {
                fetch("./php/login/tempLogout.php", {
                    method: "GET",
                }).then((x) => {
                    setGlobalAppContext({...globalAppContext, isLoggedIn: false});
                });
            }}>Logout</a></p>
        </div>
    );
};

Main.propTypes = {};

export default Main;
