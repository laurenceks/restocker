import React from 'react';
import PropTypes from 'prop-types';
import LoginInput from "./loginComponents/LoginInput";
import LoginCheckbox from "./loginComponents/LoginCheckbox";
import {NavLink} from "react-router-dom";
import LoginLink from "./loginComponents/LoginLink";

const Login = props => {
    return (
        <form className={"loginForm align-middle"}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <LoginInput type={"email"} placeholder={"you@example.com"} label={"Email address"} id={"inputLoginEmail"}
                        inputClass={"rounded-0 rounded-top"}/>
            <LoginInput type={"password"} placeholder={"Password"} label={"Password"} id={"inputLoginPassword"}
                        inputClass={"stackedInput rounded-0 rounded-bottom"}/>
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
