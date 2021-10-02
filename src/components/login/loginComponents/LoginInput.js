import React from 'react';
import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import {Typeahead} from "react-bootstrap-typeahead";

const LoginInput = ({
                        type,
                        placeholder,
                        id,
                        label,
                        inputClass,
                        invalidFeedback,
                        passwordId,
                        onChange,
                        min,
                        max,
                        step,
                        typeaheadProps
                    }) => {
    return (
        <div className={"loginInputWrap"}>
            {type === "typeahead" ?
                <Typeahead
                    id={id}
                    placeholder={placeholder || label}
                    {...typeaheadProps}
                />
                :
                <div className="form-floating">
                    <input type={type} className={`form-control loginInput${inputClass ? ` ${inputClass}` : ""}`}
                           id={id}
                           placeholder={placeholder || label}
                           data-passwordid={passwordId}
                           min={min}
                           max={max}
                           step={step}
                           onChange={(e) => {
                               if (onChange) {
                                   onChange(id, e.target.value)
                               }
                           }}/>
                    <label htmlFor={id}>{label}</label>
                </div>
            }
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
    passwordId: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
};
LoginInput.defaultProps = {
    type: "text",
    placeholder: "Input",
    id: "input-" + Math.random(),
    label: "Input",
    inputClass: null,
    invalidFeedback: null,
    passwordId: null,
    onChange: null,
    min: null,
    max: null,
    step: 1,
};

export default LoginInput;
