import {useRef, useState} from 'react';
import LoginInput from "./loginComponents/LoginInput";
import LoginLink from "./loginComponents/LoginLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";
import {useHistory} from "react-router-dom";


const ReVerify = props => {
    const [reVerifyFeedback, setReverifyFeedback] = useState(null);
    const reVerifyForm = useRef();
    const reVerify = formOutput => {
        fetch("./php/login/resendVerify.php", {
            method: "POST",
            body: JSON.stringify(formOutput.values)
        }).then((x) => {
            x.json().then((x) => {
                setReverifyFeedback({
                    ...reVerifyFeedback,
                    success: x.success,
                    text: x.feedback,
                    class: x.success ? "bg-success" : "bg-danger",
                })
            })
        });
    }

    return (
        <form className={"loginForm align-middle"} ref={reVerifyForm} onSubmit={(e) => {
            validateForm(e, reVerifyForm, reVerify)
        }} noValidate>
            <h1 className="h3 mb-3 fw-normal">Resend verification email</h1>
            {!reVerifyFeedback && <>
                <div className="reVerifyFormInputGroup mb-3">
                    <LoginInput type={"email"} placeholder={"you@example.com"}
                                label={"Email address"}
                                id={"inputReVerifyEmail"}
                                invalidFeedback={"Please enter your email address"}/>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Re-send verification email</button>
            </>
            }
            {reVerifyFeedback &&
            <LoginFeedback feedbackText={reVerifyFeedback.text} feedbackClass={reVerifyFeedback.class}/>}
            {!reVerifyFeedback &&
            <LoginLink to={"/forgotPassword"} label={"Forgot password"}/>}
            <LoginLink to={"/login"} label={"Back to login"}/>
            <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
        </form>
    );
};

ReVerify.propTypes = {};

export default ReVerify;
