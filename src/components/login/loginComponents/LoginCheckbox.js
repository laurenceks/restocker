import React from 'react';
import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";

const LoginCheckbox = ({placeholder, id, label, inputClass, invalidFeedback, checkRequired}) => {
    return (
        <div className="checkbox my-3 d-flex align-items-center flex-wrap">
            <input type="checkbox" id={id} className={`ms-2${inputClass && ` ${inputClass}`}`}
                   data-checkrequired={checkRequired}/>
            <label htmlFor={id} className={"ms-2"}>
                {label}
            </label>
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

LoginCheckbox.propTypes = {
    placeholder: PropTypes.bool,
    checkRequired: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    inputClass: PropTypes.string,
    invalidFeedback: PropTypes.string
};
LoginCheckbox.defaultProps = {
    placeholder: false,
    checkRequired: false,
    id: "inputCheckbox-" + Math.random(),
    label: "Checkbox",
    inputClass: null,
    invalidFeedback: null,
};

export default LoginCheckbox;
