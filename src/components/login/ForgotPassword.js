import React from 'react';
import PropTypes from 'prop-types';
import LoginInput from "./loginComponents/LoginInput";
import LoginCheckbox from "./loginComponents/LoginCheckbox";
import {NavLink} from "react-router-dom";
import LoginLink from "./loginComponents/LoginLink";

const Login = props => {
    return (
        <form className={"loginForm align-middle"}>
            <h1 className="h3 mb-3 fw-normal">Register</h1>
            <div className="mb-3">
                <LoginInput type={"text"} placeholder={"John"} label={"First name"} id={"inputRegisterFirstName"}
                            inputClass={"rounded-0 rounded-top"}/>
                <LoginInput type={"text"} placeholder={"Smith"} label={"Last name"} id={"inputRegisterLastName"}
                            inputClass={"rounded-0 rounded-bottom stackedInput"}/>
            </div>
            <div className="mb-3">
                <LoginInput type={"email"} placeholder={"you@example.com"} label={"Email address"}
                            id={"inputRegisterEmail"}
                            inputClass={"rounded-0 rounded-top"}/>
                <LoginInput type={"password"} placeholder={"Password"} label={"Password"} id={"inputRegisterPassword"}
                            inputClass={"stackedInput rounded-0"}/>
                <LoginInput type={"password"} placeholder={"Confirm password"} label={"Confirm password"}
                            id={"inputRegisterConfirmPassword"}
                            inputClass={"stackedInput rounded-0 rounded-bottom"}/>
            </div>
            <LoginInput type={"text"} placeholder={"Organisation"} label={"Organisation"}
                        id={"inputRegisterOrganisation"}/>
            <LoginLink to={"/registerOrganisation"} label={"Register a new organisation"}/>
            <LoginCheckbox id={"inputRegisterTsandCs"} label={"I agree to the terms and conditions"}/>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
            <LoginLink to={"/login"} label={"Login with an existing account"}/>
            <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
        </form>
    );
};

Login.propTypes = {};

export default Login;
