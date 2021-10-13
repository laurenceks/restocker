import React from 'react';
import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";

const InputCheckbox = ({id, label, inputClass, invalidFeedback, checkRequired, type, onChange, name, className}) => {
    return (
        <div className={`form-check checkbox ${className && `${className}`}`}>
            <input type={type} id={id} className={`form-check-input ${inputClass && ` ${inputClass}`}`}
                   data-checkrequired={checkRequired}
                   name={name}
                   onChange={(e) => {
                       if (onChange) {
                           onChange(id, e.target.value)
                       }
                   }}/>
            <label htmlFor={id} className={"form-check-label"}>
                {label}
            </label>
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

InputCheckbox.propTypes = {
    placeholder: PropTypes.bool,
    checkRequired: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    inputClass: PropTypes.string,
    className: PropTypes.string,
    invalidFeedback: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func
};
InputCheckbox.defaultProps = {
    placeholder: false,
    checkRequired: false,
    id: "inputCheckbox-" + Math.random(),
    label: "Checkbox",
    inputClass: null,
    className: null,
    invalidFeedback: null,
    type: "checkbox",
    name: null,
    onChange: null
};

export default InputCheckbox;
