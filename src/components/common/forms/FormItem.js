import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Typeahead} from "react-bootstrap-typeahead";
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import fetchAllItems from "../../../functions/fetchAllItems";
import naturalSort from "../../../functions/naturalSort";

const FormItem = ({
                      defaultSelected,
                      disabled,
                      form,
                      id,
                      inputClass,
                      invalidFeedback,
                      filterValues,
                      label,
                      labelKey,
                      lastUpdated,
                      onChange,
                      typeaheadProps,
                      selected
                  }) => {

    const [items, setItems] = useState([]);
    const [itemsLoadedOnce, setItemsLoadedOnce] = useState(false);
    const [updated, setUpdated] = useState(lastUpdated);
    const [selectedState, setSelectedState] = useState(defaultSelected);

    useEffect(() => {
        setUpdated(Date.now());
    }, []);

    useEffect(() => {
        getItems();
    }, [updated]);

    useEffect(() => {
        if (itemsLoadedOnce) {
            setSelectedState(selected);
        }
    }, [selected]);

    const getItems = () => {
        fetchAllItems((x) => {
            setItemsLoadedOnce(true);
            if (filterValues) {
                setItems(x.items.filter((x) => {
                    return filterValues.values.indexOf(x[filterValues.key]) === -1
                }).concat(defaultSelected || []).sort((a, b) => naturalSort(a.name, b.name)))
            } else {
                setItems(x.items.sort((a, b) => naturalSort(a.name, b.name)))
            }
        })
    }

    typeaheadProps = {
        inputProps: {
            useFloatingLabel: true,
            id: id,
            floatingLabelText: label,
            className: inputClass
        },
        options: items,
        ...typeaheadProps
    };

    return (
        <div className={"formInputWrap"}>
            <Typeahead
                id={id}
                form={form}
                {...typeaheadProps}
                disabled={disabled || !itemsLoadedOnce || typeaheadProps?.options?.length <= 1}
                options={typeaheadProps.options}
                selected={selectedState}
                //TODO don't allow new
                onChange={(e) => {
                    setSelectedState(e);
                    if (onChange) {
                        onChange(e);
                    }
                }}
                labelKey={labelKey}
            />
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

FormItem.propTypes = {
    form: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    labelKey: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    defaultSelected: PropTypes.array,
    selected: PropTypes.array
};
FormItem.defaultProps = {
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

export default FormItem;
