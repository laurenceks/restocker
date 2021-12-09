import PropTypes from 'prop-types';
import {Toast, ToastContainer} from "react-bootstrap";
import {useEffect, useState} from "react";
import {IoCheckmarkCircleOutline} from "react-icons/all";

const dividers = {
    s: 1000,
    m: 60000,
    h: 3.6e+6,
    d: 8.64e+7,
    w: 6.048e+8,
    mo: 2.628e+9,
    y: 3.154e+10
}

function CompleteToast({show, title, timestamp, bodyText, headerClass, showStateChange}) {
    const [showState, setShowState] = useState(show);
    const [timestampUpdated, setTimestampUpdated] = useState(null);
    const [timestampState, setTimestampState] = useState(timestamp);
    const [timestampText, setTimestampText] = useState("Just now");

    const calculateTimeDiff = (timeInMs) => {
        const diff = Date.now() - timeInMs;
        switch (true) {
            case (diff < dividers.s):
                return "Just now";
            case (diff < dividers.m):
                return Math.floor(diff / dividers.s) + "s";
            case (diff < dividers.h):
                return Math.floor(diff / dividers.m) + "m";
            case (diff < dividers.d):
                return Math.floor(diff / dividers.h) + "h";
            case (diff < dividers.w):
                return Math.floor(diff / dividers.d) + "d";
            case (diff < dividers.mo):
                return Math.floor(diff / dividers.w) + "w";
            case (diff < dividers.y):
                return Math.floor(diff / dividers.mo) + "mo";
            case (diff >= dividers.y):
                return Math.floor(diff / dividers.y) + "y";
            default:
                return diff + "ms";
        }
    }
    const timeUntilNext = (from, unit = "s") => {
        let divider = dividers[unit];
        return (Math.ceil(from / divider) * divider) - from;
    }

    useEffect(() => {
        if (show) {
            setTimestampUpdated(Date.now());
            setTimestampState(Date.now);
        }
        setShowState(show);
    }, [show]);

    useEffect(() => {
        showStateChange(showState)
    }, [showState]);

    useEffect(() => {
        if (showState) {
            //timestamp has been updated and the toast is still showing - update the text to the current time difference
            const timeDiff = calculateTimeDiff(timestampState);
            setTimestampText(timeDiff);
            setTimeout(() => {
                //trigger new update to timestamp text on the next second
                setTimestampUpdated(Date.now());
            }, timeUntilNext(Date.now(), "s"));
        }
    }, [timestampUpdated]);

    return (
        <ToastContainer className="p-3" position="bottom-end">
            <Toast style={{whiteSpace: "pre-wrap"}}
                   onClose={() => setShowState(false)}
                   onClick={() => setShowState(false)}
                   show={showState}
                   // delay={3000}
                // autohide
                   className="cursor-pointer">
                <Toast.Header className={headerClass} closeButton={false}>
                    <IoCheckmarkCircleOutline className={"smallIcon me-2"}/>
                    <p className="fs-5 my-0 me-auto">{title}</p>
                    <small>{timestampText}</small>
                </Toast.Header>
                <Toast.Body className={"position-relative"}>
                    {bodyText}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

CompleteToast.propTypes = {
    show: PropTypes.bool,
    handleClick: PropTypes.func,
    buttonText: PropTypes.string,
    buttonVariant: PropTypes.string,
    bodyText: PropTypes.string,
    headerClass: PropTypes.string,
    title: PropTypes.string
};

CompleteToast.defaultProps = {
    show: false,
    timestamp: Date.now(),
    timestampText: Date.now(),
    title: "Success",
    bodyText: "The operation was completed successfully",
    headerClass: "bg-success text-white",
    buttonVariant: "primary"
}

export default CompleteToast;
