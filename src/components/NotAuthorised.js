import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import ForgotPassword from "./login/ForgotPassword";
import Verify from "./login/Verify";
import ReVerify from "./login/ReVerify";

const NotAuthorised = () => {

    return (
        <div className="loginForm align-middle">
            <img src="./img/logo.svg" alt="Restocker logo" className="w-100 p-3 mb-4"/>
            <Switch>
                <Route path="/verify" component={Verify}/>
                <Route path="/reVerify" component={ReVerify}/>
                <Route path="/register" component={Register}/>
                <Route path="/forgotPassword" component={ForgotPassword}/>
                <Route path="/resetPassword" render={() => Verify("password")}/>
                <Route path="/login" component={Login}/>
                <Redirect to="/login"/>
            </Switch>
        </div>
    );
};

export default NotAuthorised;
