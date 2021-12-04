import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import ForgotPassword from "./login/ForgotPassword";
import Verify from "./login/Verify";
import ReVerify from "./login/ReVerify";

const NotAuthorised = () => {

    return (
        <Switch>
            <div className="loginForm align-middle">
                <img src="/img/logo.svg" className="w-100 p-3 mb-4"/>
                <Route path="/verify">
                    <Verify/>
                </Route>
                <Route path="/reVerify">
                    <ReVerify/>
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
                <Route path="/resetPassword">
                    <Verify type={"password"}/>
                </Route>
                <Route>
                    <Redirect to="/login"/>
                </Route>
            </div>
        </Switch>
    );
};

export default NotAuthorised;
