import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import LoginInput from "./loginComponents/LoginInput";
import LoginCheckbox from "./loginComponents/LoginCheckbox";
import {NavLink} from "react-router-dom";
import LoginLink from "./loginComponents/LoginLink";
import validateForm from "../../functions/formValidation.js"

const login = form => {
    //add onchange events to form validation context to get values
    console.log("Login");
}

const Login = props => {
    const loginForm = useRef();

    return (
        <form className={"loginForm align-middle"} ref={loginForm} onSubmit={(e) => {
            validateForm(e, loginForm, login)
        }} noValidate>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <div className="loginFormInputGroup mb-3">
                <LoginInput type={"email"} placeholder={"you@example.com"}
                            label={"Email address"}
                            id={"inputLoginEmail"}
                            invalidFeedback={"Please enter your email address"}/>
                <LoginInput type={"password"} placeholder={"Password"} label={"Password"}
                            id={"inputLoginPassword"}
                            invalidFeedback={"Please enter your password"}/>
            </div>
            <LoginCheckbox id={"inputLoginRemember"} label={"Remember me"}/>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            <LoginLink to={"/forgotPassword"} label={"Forgot password"}/>
            <LoginLink to={"/register"} label={"Register"}/>
            <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
        </form>
    );
};

Login.propTypes = {};

export default Login;
