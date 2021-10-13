import React, {useEffect, useState} from 'react';
import LoginLink from "./forms/LoginLink";
import {NavLink} from "react-router-dom";
import {IoCheckmarkCircleOutline, IoCloseCircleOutline, IoSyncCircleOutline} from "react-icons/all";
import PropTypes from "prop-types";
import LoginFeedback from "./LoginFeedback";
import ResetPassword from "./ResetPassword";

const Verify = ({type}) => {
        const params = new URLSearchParams(new URL(window.location.href.replace("/#", "")).search);
        const [paramsState, setParamsState] = useState({
            validParams: false, validationInProgress: false, params: {
                token: params.get("token"),
                selector: params.get("selector")
            }
        });
        useEffect(() => {
            if (!params.get("selector") || !params.get("token")) {
                setParamsState({
                    ...paramsState,
                    validParams: false,
                    feedback: "Invalid parameters passed",
                    feedbackClass: "bg-danger",
                    icon: <IoCloseCircleOutline className="largeIcon text-danger"/>
                })
            } else {
                setParamsState({
                    ...paramsState,
                    validParams: true,
                    validationInProgress: true,
                    feedback: "Verifying",
                    feedbackClass: "bg-warning",
                    icon: <IoSyncCircleOutline className="largeIcon text-warning spinner"/>
                });
                fetch(type === "verify" ? "./php/login/verify/verify.php" : "./php/login/resetPassword/verifyPasswordReset.php", {
                    method: "POST",
                    body: JSON.stringify({
                        token: params.get("token"),
                        selector: params.get("selector")
                    })
                }).then((x) => {
                    x.json().then((x) => {
                        setParamsState({
                                ...paramsState,
                                ...x,
                                feedbackClass: x.success ? "bg-success" : "bg-danger",
                                icon: x.success ? <IoCheckmarkCircleOutline className="largeIcon text-success"/> :
                                    <IoCloseCircleOutline className="largeIcon text-danger"/>
                            }
                        )
                    })
                });
            }

        }, []);

        return (
            <div className="loginForm">
                <h1 className="h3 mb-3 fw-normal">{type === "password" ? "Reset your password" : "Verify your account"}</h1>
                {(type !== "password" || !paramsState.success) &&
                <div className="my-3 w-100 d-flex justify-content-center">
                    {paramsState.icon}
                </div>}
                {(type === "password" && paramsState.success) ?
                    <ResetPassword token={paramsState.params.token} selector={paramsState.params.selector}/> :
                    <LoginFeedback marginTop={false} feedbackClass={paramsState.feedbackClass}
                                   feedbackText={paramsState.feedback}/>}
                {(!paramsState.success && paramsState.feedback !== "Email address already verified" && type === "verify") &&
                <NavLink to="/reVerify" className="btn btn-primary my-3">Re-send verification email</NavLink>}
                {paramsState.success && <LoginLink to={"/login"} label="Login"/>}
            </div>
        );
    }
;

Verify.propTypes =
    {
        type: PropTypes.string
    }
;

Verify.defaultProps =
    {
        type: "verify"
    }

export default Verify;
