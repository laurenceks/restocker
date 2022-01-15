import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import fetchAllItems from "../../../functions/fetchAllItems";
import naturalSort from "../../../functions/naturalSort";
import FormTypeahead from "./FormTypeahead";
import useInitialise from "../../../hooks/useInitialise";

const FormItem = ({lastUpdated, filterValues, defaultSelected, ...props}) => {

    const [items, setItems] = useState([]);
    const [updated, setUpdated] = useState(lastUpdated);
    const itemsLoadedOnce = useRef(false);

    useInitialise(() => {
        setUpdated(Date.now());
    });

    useEffect(() => {
        getItems();
    }, [updated]);

    const getItems = () => {
        fetchAllItems((x) => {
            itemsLoadedOnce.current = true;
            if (filterValues) {
                setItems(x.items.filter((x) => {
                    return filterValues.values.indexOf(x[filterValues.key]) === -1
                }).concat(defaultSelected || []).sort((a, b) => naturalSort(a.name, b.name)).filter((x) => !x.deleted))
            } else {
                setItems(x.items.sort((a, b) => naturalSort(a.name, b.name)).filter((x) => !x.deleted))
            }
        })
    }

    return <FormTypeahead {...props} options={items}/>;
};

FormItem.propTypes = {
    lastUpdated: PropTypes.number
};
FormItem.defaultProps = {
    lastUpdated: null,
};

export default FormItem;
