import {useContext, useRef, useState} from 'react';
import LoginInput from "./loginComponents/LoginInput";
import LoginCheckbox from "./loginComponents/LoginCheckbox";
import LoginLink from "./loginComponents/LoginLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";
import {GlobalAppContext} from "../../App";
import {useHistory} from "react-router-dom";


const Login = props => {
    const [loginFeedback, setLoginFeedback] = useState(null);
    const loginForm = useRef();
    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);
    const history = useHistory();
    const login = formOutput => {
        fetch("./php/login/login.php", {
            method: "POST",
            body: JSON.stringify(formOutput.values)
        }).then((x) => {
            x.json().then((x) => {
                if (x.success) {
                    setGlobalAppContext({...globalAppContext, isLoggedIn: true, loginCheckedOnce: true});
                    history.push("/");
                } else {
                    setLoginFeedback({text: x.feedback, class: "bg-danger"})
                }
            })
        });
    }

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
            {loginFeedback &&
            <LoginFeedback feedbackText={loginFeedback.text} feedbackClass={loginFeedback.class}/>}
            <LoginLink to={"/forgotPassword"} label={"Forgot password"}/>
            <LoginLink to={"/register"} label={"Register"}/>
            <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
        </form>
    );
};

Login.propTypes = {};

export default Login;
