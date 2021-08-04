import React, {useEffect, useState} from 'react';
import LoginLink from "./loginComponents/LoginLink";

const Verify = () => {
    const [paramsState, setParamsState] = useState({validParams: false, validationInProgress: false});
    useEffect( () => {
        const params = new URLSearchParams(new URL(window.location.href.replace("/#", "")).search);
        if (!params.get("selector") || !params.get("token")) {
            setParamsState({
                ...paramsState,
                validParams: false,
                text: "Invalid parameters passed",
                feedbackClass: "bg-danger"
            })
        } else {
            setParamsState({
                ...paramsState,
                validParams: true,
                validationInProgress: true,
                text: "Verifying",
                feedbackClass: "bg-warning",
                params: {
                    token: params.get("token"),
                    selector: params.get("selector")
                }
            })
            fetch("./php/login/verify.php", {
                method: "POST",
                body: JSON.stringify({
                    token: params.get("token"),
                    selector: params.get("selector")
                })
            }).then((x) => {
                x.json().then((x) => {
                    setParamsState({...paramsState, ...x, feedbackClass: x.success ? "bg-success" : "bg-danger"})
                })
            });
        }

    }, []);

    return (
        <div className="loginForm">
            <h1 className="h3 mb-3 fw-normal">Verify your account</h1>
            <h2>Icon here</h2>
            <div className={`p-3 rounded text-light ${paramsState.feedbackClass}`}>{paramsState.feedback}</div>
            <LoginLink to={"/login"} label="Login"/>
        </div>
    );
};

export default Verify;
