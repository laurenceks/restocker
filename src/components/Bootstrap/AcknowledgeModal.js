import PropTypes from 'prop-types';
import {Button, Modal} from "react-bootstrap";

const AcknowledgeModal = ({show, title, bodyText, handleClick, buttonText, headerClass, buttonVariant}) => {
    return (
        <Modal show={show} onHide={handleClick} backdrop="static" aria-labelledby="contained-modal-title-vcenter"
               centered>
            <Modal.Header className={headerClass}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <div style={{whiteSpace: "pre-wrap"}}><Modal.Body>{bodyText}</Modal.Body></div>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClick}>
                    {buttonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

AcknowledgeModal.propTypes = {
    show: PropTypes.bool,
    handleClick: PropTypes.func,
    buttonText: PropTypes.string,
    buttonVariant: PropTypes.string,
    bodyText: PropTypes.string,
    headerClass: PropTypes.string,
    title: PropTypes.string
};

AcknowledgeModal.defaultProps = {
    show: false,
    handleClick: (e) => {
        console.log("Button clicked, but no handler passed")
    },
    buttonText: "OK",
    title: "Are you sure?",
    bodyText: "Are you sure you wish to proceed?",
    headClass: null,
    buttonVariant: "primary"
}

export default AcknowledgeModal;
