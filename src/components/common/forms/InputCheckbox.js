import {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";

const InputCheckbox = ({
                           id,
                           label,
                           inputClass,
                           invalidFeedback,
                           checkRequired,
                           type,
                           onChange,
                           name,
                           className,
                           defaultChecked
                       }) => {
    const [inputState, setInputState] = useState(defaultChecked);
    const inputRef = useRef();
    return (
        <div className={`form-check checkbox cursor-pointer ${className && `${className}`}`} onClick={() => {
            inputRef.current.click()
        }}>
            <input type={type}
                   id={id}
                   className={`form-check-input ${inputClass && ` ${inputClass}`}`}
                   data-checkrequired={checkRequired}
                   name={name}
                   ref={inputRef}
                   onChange={(e) => {
                       setInputState(e.target.value);
                       if (onChange) {
                           onChange(id, e.target.value)
                       }
                   }}
                   defaultChecked={defaultChecked}
            />
            <label htmlFor={id} className={"form-check-label"}>
                {label}
            </label>
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

InputCheckbox.propTypes = {
    checkRequired: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    placeholder: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    inputClass: PropTypes.string,
    invalidFeedback: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func
};
InputCheckbox.defaultProps = {
    checkRequired: false,
    defaultChecked: false,
    placeholder: false,
    id: "inputCheckbox-" + Math.random(),
    label: "Checkbox",
    type: "checkbox",
    inputClass: null,
    className: null,
    invalidFeedback: null,
    name: null,
    onChange: null
};

export default InputCheckbox;
