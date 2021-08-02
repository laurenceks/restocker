import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import LoginInput from "./loginComponents/LoginInput";
import LoginCheckbox from "./loginComponents/LoginCheckbox";
import {NavLink} from "react-router-dom";
import LoginLink from "./loginComponents/LoginLink";
import validateForm from "../../functions/formValidation.js"

const forgot = (e) => {
    console.log("Forgot!")
}
const ForgotPassword = props => {
    const forgotPasswordForm = useRef();
    return (
        <form className={"loginForm align-middle"} ref={forgotPasswordForm} onSubmit={(e) => {
            validateForm(e, forgotPasswordForm, forgot)
        }} noValidate>
            <h1 className="h3 mb-3 fw-normal">Forgot password</h1>
            <div className="mb-3 loginFormInputGroup">
                <LoginInput type={"email"} placeholder={"you@example.com"} label={"Email address"}
                            id={"inputRegisterEmail"}
                            invalidFeedback={"Please enter the email address of your account"}/>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Send password reset</button>
            <LoginLink to={"/login"} label={"Login"}/>
            <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
        </form>
    );
};

ForgotPassword.propTypes = {};

export default ForgotPassword;
