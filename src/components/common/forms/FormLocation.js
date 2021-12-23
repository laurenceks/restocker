import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Typeahead} from "react-bootstrap-typeahead";
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import fetchAllItems from "../../../functions/fetchAllItems";
import naturalSort from "../../../functions/naturalSort";
import fetchAllLocations from "../../../functions/fetchAllLocations";

const FormLocation = ({
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

    const [locations, setLocations] = useState([]);
    const [locationsLoadedOnce, setLocationsLoadedOnce] = useState(false);
    const [updated, setUpdated] = useState(lastUpdated);
    const [selectedState, setSelectedState] = useState(defaultSelected);

    useEffect(() => {
        setUpdated(Date.now());
    }, []);

    useEffect(() => {
        getLocations();
    }, [updated]);

    useEffect(() => {
        if (locationsLoadedOnce) {
            setSelectedState(selected);
            onChange(locations)
        }
    }, [selected]);

    useEffect(() => {
        if (locationsLoadedOnce && locations.length === 1) {
            setSelectedState([locations[0]]);
        }
    }, [locations]);

    const getLocations = () => {
        fetchAllLocations((x) => {
            setLocationsLoadedOnce(true);
            if (filterValues) {
                setLocations(x.locations.filter((x) => {
                    return filterValues.values.indexOf(x[filterValues.key]) === -1
                }).concat(defaultSelected || []).sort((a, b) => naturalSort(a.name, b.name)))
            } else {
                setLocations(x.locations.sort((a, b) => naturalSort(a.name, b.name)))
            }
        })
    }


    return (
        <div className={"formInputWrap"}>
            <Typeahead
                id={id}
                form={form}
                inputProps={
                    {
                        useFloatingLabel: true,
                        id: id,
                        floatingLabelText: label,
                    }
                }
                {...typeaheadProps}
                disabled={disabled || !locationsLoadedOnce || locations.length <= 1}
                options={locations}
                selected={selectedState}
                onChange={(e) => {
                    setSelectedState(e);
                    if (onChange) {
                        onChange(e)
                    }
                }}
                labelKey={labelKey}
            />
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

FormLocation.propTypes = {
    form: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    labelKey: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    defaultSelected: PropTypes.array,
    selected: PropTypes.array
};
FormLocation.defaultProps = {
    form: "",
    id: "input-location-" + parseInt(Math.random() * 1000000),
    label: "Location",
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

export default FormLocation;
