import React, {createContext, useContext} from 'react';
import PropTypes from 'prop-types';
import {GlobalAppContext} from "../App";
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import ForgotPassword from "./login/ForgotPassword";
import Verify from "./login/Verify";

const NotAuthorised = props => {

    return (
        <Switch>
            <Route path="/verify">
                <Verify/>
            </Route>
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
            <Route>
                <Redirect to="/login"/>
            </Route>
        </Switch>
    );
};

NotAuthorised.propTypes = {};

export default NotAuthorised;
