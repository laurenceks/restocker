import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import LoginInput from "./loginComponents/LoginInput";
import LoginCheckbox from "./loginComponents/LoginCheckbox";
import LoginLink from "./loginComponents/LoginLink";
import validateForm from "../../functions/formValidation.js"

const register = form => {
    //add onchange events to form validation context to get values
    console.log("Register");
}

const Login = props => {

    const registerForm = useRef();

    return (
        <form className={"loginForm align-middle"} ref={registerForm} onSubmit={(e) => {
            validateForm(e, registerForm, register)
        }} noValidate>
            <h1 className="h3 mb-3 fw-normal">Register</h1>
            <div className="mb-3 loginFormInputGroup">
                <LoginInput type={"text"} placeholder={"John"} label={"First name"} id={"inputRegisterFirstName"}
                            inputClass={""} invalidFeedback={"Please enter your first name"}/>
                <LoginInput type={"text"} placeholder={"Smith"} label={"Last name"} id={"inputRegisterLastName"}
                            inputClass={""} invalidFeedback={"Please enter your last name"}/>
            </div>
            <div className="mb-3 loginFormInputGroup">
                <LoginInput type={"email"} placeholder={"you@example.com"} label={"Email address"}
                            id={"inputRegisterEmail"}
                            inputClass={""} invalidFeedback={"Please enter a valid email address"}/>
                <LoginInput type={"password"} placeholder={"Password"} label={"Password"} id={"inputRegisterPassword"}
                            inputClass={""} invalidFeedback={"Please enter a password at least eight characters long with one lower case letter, one capital, one number and a symbol"} passwordId={1}/>
                <LoginInput type={"password"} placeholder={"Confirm password"} label={"Confirm password"}
                            id={"inputRegisterConfirmPassword"}
                            inputClass={""} invalidFeedback={"Passwords do not match"} passwordId={1}/>
            </div>
            <div className="mb-3 loginFormInputGroup">
                <LoginInput type={"text"} placeholder={"Organisation"} label={"Organisation"}
                            id={"inputRegisterOrganisation"} invalidFeedback={"Please select your organisation"}/>
            </div>
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
