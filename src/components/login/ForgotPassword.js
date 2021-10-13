import {useRef, useState} from 'react';
import LoginInput from "./forms/LoginInput";
import LoginLink from "./forms/LoginLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";

const Forgot = () => {
    const [forgotFeedback, setForgotFeedback] = useState({inProgress: false});
    const forgotForm = useRef();
    const forgot = formOutput => {
        setForgotFeedback({...forgotFeedback, inProgress: true})
        fetch("./php/login/forgot/forgot.php", {
            method: "POST",
            body: JSON.stringify(formOutput.values)
        }).then((x) => {
            x.json().then((x) => {
                setForgotFeedback({
                    ...forgotFeedback,
                    ...x,
                    inProgress: false,
                    feedbackClass: x.success ? "bg-success" : "bg-danger",
                })
            })
        });
    }

    return (
        <form className={"loginForm align-middle"} ref={forgotForm} onSubmit={(e) => {
            validateForm(e, forgotForm, forgot)
        }} noValidate>
            <fieldset disabled={forgotFeedback.inProgress && "disabled"}><h1 className="h3 mb-3 fw-normal">Forgot
                password</h1>
                {(!forgotFeedback.feedback || forgotFeedback.keepFormActive) && <>
                    <div className="loginFormInputGroup mb-3">
                        <LoginInput type={"email"} placeholder={"you@example.com"}
                                    label={"Email address"}
                                    id={"inputForgotEmail"}
                                    invalidFeedback={"Please enter your email address"}/>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Send password reset</button>
                </>
                }
                {(forgotFeedback?.feedback && !forgotFeedback?.inProgress) &&
                <LoginFeedback feedbackText={forgotFeedback.feedback} feedbackClass={forgotFeedback.feedbackClass}/>}
                {forgotFeedback?.feedback === "Email not verified" &&
                <LoginLink to={"/reVerify"} label={"Re-send verification email"}/>}
                <LoginLink to={"/login"} label={"Back to login"}/>
                <p className="my-3 text-muted">&copy; Laurence Summers 2021</p></fieldset>
        </form>
    );
};

export default Forgot;