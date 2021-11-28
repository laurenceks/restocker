import PropTypes from 'prop-types';
import {Toast, ToastContainer} from "react-bootstrap";
import {useEffect, useState} from "react";
import {IoCheckmarkCircleOutline} from "react-icons/all";

function CompleteToast({show, title, timestamp, bodyText, headerClass, showStateChange}) {
    const [showState, setShowState] = useState(show);
    const [timestampUpdated, setTimestampUpdated] = useState(null);
    const [timestampState, setTimestampState] = useState(timestamp);
    const [timestampText, setTimestampText] = useState("Just now");

    const calculateTimeDiff = (timeInMs) => {
        const diff = Date.now() - timeInMs;
        switch (true) {
            case (diff < 1000):
                return "Just now";
            case (diff < 60000):
                return Math.floor(diff / 1000) + "s";
            case (diff < 3.6e+6):
                return Math.floor(diff / 60000) + "m";
            case (diff < 3.64e+6):
                return Math.floor(diff / 3.6e+6) + "h";
            case (diff < 3.048e+6):
                return Math.floor(diff / 3.64e+6) + "d";
            case (diff < 2.628e+9):
                return Math.floor(diff / 3.048e+6) + "mo";
            case (diff >= 2.628e+9):
                return Math.floor(diff / 2.628e+9) + "y";
            default:
                return diff + "ms";
        }
    }

    useEffect(() => {
        if (show) {
            setTimestampText("Just now");
            setTimestampUpdated(Date.now())
            setTimestampState(Date.now());
        }
        setShowState(show);
    }, [show]);

    useEffect(() => {
        showStateChange(showState)
    }, [showState]);

    useEffect(() => {
        if (showState) {
            setTimeout(() => {
                setTimestampUpdated(Date.now())
                setTimestampText(calculateTimeDiff(timestampState))
            }, 1000)
        }
    }, [timestampUpdated]);

    return (
        <ToastContainer className="p-3" position="bottom-end">
            <Toast onClose={() => setShowState(false)} onClick={() => setShowState(false)} show={showState} delay={3000}
                   autohide className="cursor-pointer">
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
