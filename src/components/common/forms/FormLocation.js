import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import fetchAllLocations from "../../../functions/fetchAllLocations";
import naturalSort from "../../../functions/naturalSort";
import FormTypeahead from "./FormTypeahead";

const FormLocation = ({lastUpdated, filterValues, defaultSelected, ...props}) => {

    const [locations, setLocations] = useState([]);
    const [updated, setUpdated] = useState(lastUpdated);
    const locationsLoadedOnce = useRef(false);

    useEffect(() => {
        setUpdated(Date.now());
    }, []);

    useEffect(() => {
        getItems();
    }, [updated]);

    const getItems = () => {
        fetchAllLocations((x) => {
            locationsLoadedOnce.current = true;
            if (filterValues) {
                setLocations(x.locations.filter((x) => {
                    return filterValues.values.indexOf(x[filterValues.key]) === -1
                }).concat(defaultSelected || []).sort((a, b) => naturalSort(a.name, b.name)).filter((x) => !x.deleted))
            } else {
                setLocations(x.locations.sort((a, b) => naturalSort(a.name, b.name)).filter((x) => !x.deleted))
            }
        })
    }

    return <FormTypeahead {...props} options={locations}/>;
};

FormLocation.propTypes = {
    lastUpdated: PropTypes.number
};
FormLocation.defaultProps = {
    lastUpdated: null,
};

export default FormLocation;
