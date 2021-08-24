import PropTypes from 'prop-types';
import {Button, Modal} from "react-bootstrap";

const ConfirmModal = ({show, title, bodyText, handleYes, handleNo, yesText, noText}) => {
    return (
        <Modal show={show} onHide={handleNo} backdrop="static" aria-labelledby="contained-modal-title-vcenter"
               centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyText}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleNo}>
                    {noText}
                </Button>
                <Button variant="primary" onClick={handleYes}>
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
    yesText: PropTypes.string,
    noText: PropTypes.string,
    bodyText: PropTypes.string,
    title: PropTypes.string
};

ConfirmModal.defaultProps = {
    show: false,
    handleYes: (e) => {
        console.log("Yes clicked, but no handler passed")
    },
    handleNo: (e) => {
        console.log("No/cancel clicked, but no handler passed")
    },
    yesText: "Yes",
    noText: "Cancel",
    title: "Are you sure?",
    bodyText: "Are you sure you wish to proceed?"
}

export default ConfirmModal;
