import React from 'react';
import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";

const LoginInput = ({type, placeholder, id, label, inputClass, invalidFeedback, passwordId}) => {
    return (
        <div className="form-floating">
            <input type={type} className={`form-control loginInput${inputClass ? ` ${inputClass}` : ""}`} id={id}
                   placeholder={placeholder}
                   data-passwordid={passwordId}/>
            <label htmlFor={id}>{label}</label>
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

LoginInput.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    inputClass: PropTypes.string,
    passwordId: PropTypes.number
};
LoginInput.defaultProps = {
    type: "text",
    placeholder: null,
    id: "input-" + Math.random(),
    label: "Input",
    inputClass: null,
    invalidFeedback: null,
    passwordId: null
};

export default LoginInput;
