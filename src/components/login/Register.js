import React, {useEffect, useRef, useState} from 'react';
import LoginInput from "./loginComponents/LoginInput";
import LoginCheckbox from "./loginComponents/LoginCheckbox";
import LoginLink from "./loginComponents/LoginLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "@gouch/to-title-case";

const Register = () => {
    const [registerFeedback, setRegisterFeedback] = useState({success: false, inProgress: false});
    const [organisations, setOrganisations] = useState([]);
    const [organisation, setOrganisation] = useState({});
    const registerForm = useRef();

    useEffect(() => {
        fetch("./php/common/getUserOrganisations.php", {
            method: "GET",
        }).then((x) => {
            x.json().then((x) => {
                setOrganisations(x);
            })
        })
    }, []);

    const register = formOutput => {
        setRegisterFeedback({...registerFeedback, inProgress: true})
        fetch("./php/login/register.php", {
            method: "POST",
            body: JSON.stringify({...formOutput.values, organisation: organisation})
        }).then((x) => {
            x.json().then((x) => {
                setRegisterFeedback({
                    ...registerFeedback,
                    ...x,
                    inProgress: false,
                    feedbackClass: x.success ? "bg-success" : "bg-danger",
                })
            })
        });
    }
    return (
        <form className={"loginForm align-middle"} ref={registerForm} onSubmit={(e) => {
            validateForm(e, registerForm, register, {organisation: organisation})
        }} noValidate>
            <fieldset disabled={(registerFeedback.inProgress || !organisations) && "disabled"}>
                {!registerFeedback.success &&
                <><h1 className="h3 mb-3 fw-normal">Register</h1>
                    <div className="mb-3 loginFormInputGroup">
                        <LoginInput type={"text"} placeholder={"John"} label={"First name"}
                                    id={"inputRegisterFirstName"}
                                    inputClass={""} invalidFeedback={"Please enter your first name"}/>
                        <LoginInput type={"text"} placeholder={"Smith"} label={"Last name"}
                                    id={"inputRegisterLastName"}
                                    inputClass={""} invalidFeedback={"Please enter your last name"}/>
                    </div>
                    <div className="mb-3 loginFormInputGroup">
                        <LoginInput type={"email"} placeholder={"you@example.com"} label={"Email address"}
                                    id={"inputRegisterEmail"}
                                    inputClass={""} invalidFeedback={"Please enter a valid email address"}/>
                        <LoginInput type={"password"} placeholder={"Password"} label={"Password"}
                                    id={"inputRegisterPassword"}
                                    inputClass={""}
                                    invalidFeedback={"Please enter a password at least eight characters long with one lower case letter, one capital, one number and a symbol"}
                                    passwordId={1}/>
                        <LoginInput type={"password"} placeholder={"Confirm password"} label={"Confirm password"}
                                    id={"inputRegisterConfirmPassword"}
                                    inputClass={""} invalidFeedback={"Passwords do not match"} passwordId={1}/>
                    </div>
                    <div className="mb-3 loginFormInputGroup">
                        <LoginInput type={"typeahead"}
                                    id={"inputRegisterOrganisationWrap"}
                                    typeaheadProps={{
                                        inputProps:
                                            {
                                                id: "inputRegisterOrganisation",
                                                useFloatingLabel: true,
                                                floatingLabelText: "Organisation",
                                                className: "loginInput",
                                                "data-statename": "organisation"
                                            },
                                        allowNew: true,
                                        onChange: (e) => setOrganisation(e[0] ? {
                                            ...e[0],
                                            organisation: e[0].customOption ? e[0].organisation.toTitleCase() : e[0].organisation
                                        } : {}),
                                        onInputChange: (x, e) => {
                                            //TODO set input value to toTitleCase?
                                            //setOrganisation([]);
                                        },
                                        labelKey: "organisation",
                                        options: organisations
                                    }}
                                    invalidFeedback={"Please select your organisation, or add a new one"}
                        />
                        {organisation && organisation.customOption &&
                        <p className="my-3 text-muted small">{organisation.organisation} will be saved as a new
                            organisation with you as the admin</p>}
                    </div>
                    <LoginCheckbox id={"inputRegisterTsandCs"} label={"I agree to the terms and conditions"}
                                   invalidFeedback={"You must agree to the terms and conditions"}
                                   checkRequired={true}/>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
                </>
                }
                {
                    (registerFeedback.feedback && !registerFeedback.inProgress) &&
                    <LoginFeedback feedbackText={registerFeedback.feedback}
                                   feedbackClass={registerFeedback.feedbackClass}/>
                }
                <LoginLink to={"/login"}
                           label={registerFeedback.success ? "Back to login" : "Login with an existing account"}/>
                <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
            </fieldset>
        </form>
    );
};

export default Register;
