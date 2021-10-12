import {useState} from 'react';
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
                        typeaheadProps,
                        defaultValue,
                        form
                    }) => {
    const [inputState, setInputState] = useState(defaultValue || "");
    return (
        <div className={"loginInputWrap"}>
            {type === "typeahead" ?
                <Typeahead
                    id={id}
                    placeholder={placeholder || label}
                    form={form}
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
                               setInputState(type === "number" ? parseInt(e.target.value) : e.target.value);
                               if (onChange) {
                                   onChange(id, e.target.value)
                               }
                           }}
                           form={form}
                           value={inputState}
                    />
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
    form: PropTypes.string,
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
    form: ""
};

export default LoginInput;
