import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import {Typeahead} from "react-bootstrap-typeahead";
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import setCase from "../../../functions/setCase";

const FormTypeahead = ({
                           defaultSelected,
                           disabled,
                           form,
                           id,
                           inputClass,
                           invalidFeedback,
                           filterValues,
                           forceCase,
                           label,
                           labelKey,
                           onChange,
                           options,
                           selected,
                           ...props
                       }) => {

    const [selectedState, setSelectedState] = useState(defaultSelected);
    const typeaheadInputRef = useRef();

    useEffect(() => {
        setSelectedState(selected);
    }, [selected]);

    const inputProps = {
        useFloatingLabel: true,
        id: id,
        floatingLabelText: label,
        className: inputClass,
        ...props.inputProps
    };

    return (
        <div className={"formInputWrap"}>
            <Typeahead
                {...props}
                ref={typeaheadInputRef}
                id={id}
                form={form}
                inputProps={{...inputProps}}
                disabled={disabled || options?.length <= 1}
                options={options}
                selected={selectedState}
                onChange={(e) => {
                    forceCase && e[0] && (e[0][labelKey] = setCase(e[0][labelKey], forceCase));
                    setSelectedState(e);
                    if (onChange) {
                        onChange(e);
                    }
                }}
                onBlur={(e) => {
                    if (selectedState.length === 0) {
                        typeaheadInputRef.current.clear();
                    }
                }}
                labelKey={labelKey}
            />
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

FormTypeahead.propTypes = {
    form: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    labelKey: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    defaultSelected: PropTypes.array,
    selected: PropTypes.array
};
FormTypeahead.defaultProps = {
    form: "",
    id: "input-" + parseInt(Math.random() * 1000000),
    label: "Input",
    labelKey: "name",
    disabled: false,
    defaultValue: null,
    forceCase: null,
    inputClass: null,
    invalidFeedback: null,
    max: null,
    min: null,
    onChange: null,
    passwordId: null,
    defaultSelected: [],
    selected: [],
    step: 1,
};

export default FormTypeahead;
