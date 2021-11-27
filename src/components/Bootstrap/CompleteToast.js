import PropTypes from 'prop-types';
import {Toast, ToastContainer} from "react-bootstrap";
import {useEffect, useState} from "react";
import {IoCheckmarkCircleOutline} from "react-icons/all";

function CompleteToast({show, title, timestamp, bodyText, headerClass, showStateChange}) {
    const [showState, setShowState] = useState(show);
    const [timestampState, setTimestampState] = useState(timestamp);

    useEffect(() => {
        setShowState(show);
    }, [show]);

    useEffect(() => {
        if (showState) {
            setTimestampState(Date().substr(16, 8))
        }
        showStateChange(showState)
    }, [showState]);

    return (
        <ToastContainer className="p-3" position="bottom-end">
            <Toast onClick={() => setShowState(false)} show={showState} delay={3000} autohide className="cursor-pointer">
                <Toast.Header className={headerClass} closeButton={false}>
                    <IoCheckmarkCircleOutline className={"smallIcon me-2"}/>
                        <p className="fs-5 my-0 me-auto">{title}</p>
                        <small>{timestampState}</small>
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
    timestamp: Date().substr(16, 8),
    title: "Success",
    bodyText: "The operation was completed successfully",
    headerClass: "bg-success text-white",
    buttonVariant: "primary"
}

export default CompleteToast;
