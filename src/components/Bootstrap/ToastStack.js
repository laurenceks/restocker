import PropTypes from 'prop-types';
import {ToastContainer} from "react-bootstrap";
import CompleteToast from "./CompleteToast";
import {useContext, useEffect, useRef, useState} from "react";
import {GlobalAppContext} from "../../App";

function ToastStack({toasts, position}) {
    useEffect(() => {
        console.log(toasts);
    }, [toasts]);

    return (
        <ToastContainer className="p-3 position-fixed" position={position}>
            {toasts.map((x, i) => {
                return <CompleteToast key={"toast-" + x.id} {...x}/>
            })}
        </ToastContainer>
    );
}

ToastStack.propTypes = {
    position: PropTypes.string,
    toasts: PropTypes.array
};

ToastStack.defaultProps = {
    toasts: [],
    position: "bottom-end"
}

export default ToastStack;
