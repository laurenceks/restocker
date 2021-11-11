import {useState} from 'react';
import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import {Typeahead} from "react-bootstrap-typeahead";
import setCase from "../../../functions/setCase";

const FormInput = ({
                       defaultValue,
                       disabled,
                       forceCase,
                       form,
                       id,
                       inputClass,
                       invalidFeedback,
                       label,
                       max,
                       min,
                       onChange,
                       passwordId,
                       placeholder,
                       step,
                       type,
                       typeaheadProps,
                       value
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
                               const returnValue = type === "number" && e.target.value ? parseInt(e.target.value) : forceCase && forceCase !== "" ? setCase(e.target.value, forceCase) : e.target.value;
                               if (value === undefined || value === null) {
                                   //uncontrolled input
                                   setInputState(returnValue);
                               }
                               if (onChange) {
                                   onChange(id, returnValue);
                               }
                           }}
                           form={form}
                           defaultValue={defaultValue}
                           value={value === "" || value ? value : inputState}
                           disabled={disabled}
                    />
                    <label htmlFor={id}>{label}</label>
                </div>
            }
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

FormInput.propTypes = {
    forceCase: PropTypes.string,
    form: PropTypes.string,
    id: PropTypes.string,
    inputClass: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    passwordId: PropTypes.number,
    step: PropTypes.number,
    disabled: PropTypes.bool
};
FormInput.defaultProps = {
    form: "",
    id: "input-" + parseInt(Math.random() * 1000000),
    label: "Input",
    placeholder: "Input",
    type: "text",
    disabled: false,
    defaultValue: null,
    forceCase: null,
    inputClass: null,
    invalidFeedback: null,
    max: null,
    min: null,
    onChange: null,
    passwordId: null,
    step: 1,
};

export default FormInput;
