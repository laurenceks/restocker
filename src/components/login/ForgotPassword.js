import {useRef, useState} from 'react';
import LoginInput from "./loginComponents/LoginInput";
import LoginLink from "./loginComponents/LoginLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";
import {useHistory} from "react-router-dom";


const Forgot = props => {
    const [forgotFeedback, setForgotFeedback] = useState(null);
    const forgotForm = useRef();
    const forgot = formOutput => {
        fetch("./php/login/forgot/forgot.php", {
            method: "POST",
            body: JSON.stringify(formOutput.values)
        }).then((x) => {
            x.text().then((x) => {
                console.log(x);
                x = JSON.parse(x);
                setForgotFeedback({
                    ...forgotFeedback,
                    success: x.success,
                    text: x.feedback,
                    class: x.success ? "bg-success" : "bg-danger",
                })
            })
        });
    }

    return (
        <form className={"loginForm align-middle"} ref={forgotForm} onSubmit={(e) => {
            validateForm(e, forgotForm, forgot)
        }} noValidate>
            <h1 className="h3 mb-3 fw-normal">Forgot password</h1>
            {!forgotFeedback && <>
                <div className="reVerifyFormInputGroup mb-3">
                    <LoginInput type={"email"} placeholder={"you@example.com"}
                                label={"Email address"}
                                id={"inputForgotEmail"}
                                invalidFeedback={"Please enter your email address"}/>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Send password reset</button>
            </>
            }
            {forgotFeedback &&
            <LoginFeedback feedbackText={forgotFeedback.text} feedbackClass={forgotFeedback.class}/>}
            <LoginLink to={"/login"} label={"Back to login"}/>
            <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
        </form>
    );
};

Forgot.propTypes = {};

export default Forgot;