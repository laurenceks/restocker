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
                        typeaheadProps
                    }) => {
    return (
        <div className={"loginInputWrap"}>
            {type === "typeahead" ?
                <Typeahead
                    id={id}
                    {...typeaheadProps}
                />
                :
                <div className="form-floating">
                    <input type={type} className={`form-control loginInput${inputClass ? ` ${inputClass}` : ""}`}
                           id={id}
                           placeholder={placeholder}
                           data-passwordid={passwordId}
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
    passwordId: PropTypes.number
};
LoginInput.defaultProps = {
    type: "text",
    placeholder: null,
    id: "input-" + Math.random(),
    label: "Input",
    inputClass: null,
    invalidFeedback: null,
    passwordId: null,
    onChange: null
};

export default LoginInput;
