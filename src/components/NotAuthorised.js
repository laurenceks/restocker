import React, {createContext, useContext} from 'react';
import PropTypes from 'prop-types';
import {GlobalAppContext} from "../App";
import {Route, Switch, useHistory} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import ForgotPassword from "./login/ForgotPassword";

const NotAuthorised = props => {
    //if no other path, render login
    const history = useHistory();
    if (history.location.pathname === "/") {
        history.push("/login")
    }

    return (
        <Switch>
            <Route path="/login">
                <Login/>
            </Route>
            <Route path="/register">
                <Register/>
            </Route>
            <Route path="/registerOrganisation">
                <p>Register organisation</p>
            </Route>
            <Route path="/forgotPassword">
                <ForgotPassword/>
            </Route>
        </Switch>
    );
};

NotAuthorised.propTypes = {};

export default NotAuthorised;
