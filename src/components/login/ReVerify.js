import {useRef, useState} from 'react';
import LoginInput from "./loginComponents/LoginInput";
import LoginLink from "./loginComponents/LoginLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";
import {useHistory} from "react-router-dom";


const ReVerify = props => {
    const [reVerifyFeedback, setReverifyFeedback] = useState({inProgress: false});
    const reVerifyForm = useRef();
    const reVerify = formOutput => {
        setReverifyFeedback({...reVerifyFeedback, inProgress: true});
        fetch("./php/login/verify/resendVerify.php", {
            method: "POST",
            body: JSON.stringify(formOutput.values)
        }).then((x) => {
            x.json().then((x) => {
                setReverifyFeedback({
                    ...reVerifyFeedback,
                    ...x,
                    inProgress: false,
                    feedbackClass: x.success ? "bg-success" : "bg-danger",
                })
            })
        });
    }

    return (
        <form className={"loginForm align-middle"} ref={reVerifyForm} onSubmit={(e) => {
            validateForm(e, reVerifyForm, reVerify)
        }} noValidate>
            <fieldset disabled={reVerifyFeedback.inProgress && "disabled"}>
                <h1 className="h3 mb-3 fw-normal">Resend verification email</h1>
                {(!reVerifyFeedback.feedback || reVerifyFeedback.keepFormActive) && <>
                    <div className="reVerifyFormInputGroup mb-3">
                        <LoginInput type={"email"} placeholder={"you@example.com"}
                                    label={"Email address"}
                                    id={"inputReVerifyEmail"}
                                    invalidFeedback={"Please enter your email address"}/>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Re-send verification email</button>
                </>
                }
                {(reVerifyFeedback.feedback && !reVerifyFeedback.inProgress) &&
                <LoginFeedback feedbackText={reVerifyFeedback.feedback}
                               feedbackClass={reVerifyFeedback.feedbackClass}/>}
                {!reVerifyFeedback.feedback &&
                <LoginLink to={"/forgotPassword"} label={"Forgot password"}/>}
                <LoginLink to={"/login"} label={"Back to login"}/>
                <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
            </fieldset>
        </form>
    );
};

ReVerify.propTypes = {};

export default ReVerify;
