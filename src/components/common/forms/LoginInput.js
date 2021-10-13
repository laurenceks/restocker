import {useState} from 'react';
import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import {Typeahead} from "react-bootstrap-typeahead";
import setCase from "../../../functions/setCase";

const LoginInput = ({
                        defaultValue,
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
                               if (forceCase && forceCase !== "") {
                                   setInputState(setCase(e.target.value, forceCase));
                               }
                               if (onChange) {
                                   onChange(id, e.target.value);
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
};
LoginInput.defaultProps = {
    form: "",
    id: "input-" + Math.random(),
    label: "Input",
    placeholder: "Input",
    type: "text",
    forceCase: null,
    inputClass: null,
    invalidFeedback: null,
    max: null,
    min: null,
    onChange: null,
    passwordId: null,
    step: 1,
};

export default LoginInput;
