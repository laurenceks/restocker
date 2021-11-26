import PropTypes from 'prop-types';
import {Button, Modal} from "react-bootstrap";

const ConfirmModal = ({show, title, bodyText, handleYes, handleNo, yesText, noText, headerClass, yesButtonVariant, noButtonVariant}) => {
    return (
        <Modal show={show} onHide={handleNo} backdrop="static" aria-labelledby="contained-modal-title-vcenter"
               centered>
            <Modal.Header className={headerClass}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyText}</Modal.Body>
            <Modal.Footer>
                <Button variant={noButtonVariant} onClick={handleNo}>
                    {noText}
                </Button>
                <Button variant={yesButtonVariant} onClick={handleYes}>
                    {yesText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ConfirmModal.propTypes = {
    show: PropTypes.bool,
    handleYes: PropTypes.func,
    handleNo: PropTypes.func,
    bodyText: PropTypes.string,
    headerClass: PropTypes.string,
    noText: PropTypes.string,
    noButtonVariant: PropTypes.string,
    title: PropTypes.string,
    yesText: PropTypes.string,
    yesButtonVariant: PropTypes.string,
};

ConfirmModal.defaultProps = {
    show: false,
    headerClass: null,
    handleNo: (e) => {
        console.log("No/cancel clicked, but no handler passed")
    },
    handleYes: (e) => {
        console.log("Yes clicked, but no handler passed")
    },
    bodyText: "Are you sure you wish to proceed?",
    noText: "Cancel",
    noButtonVariant: "secondary",
    title: "Are you sure?",
    yesText: "Yes",
    yesButtonVariant: "primary",
}

export default ConfirmModal;
