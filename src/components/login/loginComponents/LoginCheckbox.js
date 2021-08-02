import React from 'react';
import PropTypes from 'prop-types';

const LoginCheckbox = ({placeholder, id, label, inputClass}) => {
    return (
        <div className="checkbox my-3 d-flex align-items-center">
            <input type="checkbox" value="remember-me" id={id} className={`ms-2${inputClass && ` ${inputClass}`}`}/>
            <label htmlFor={id} className={"ms-2"}>
                {label}
            </label>
        </div>
    );
};

LoginCheckbox.propTypes = {
    placeholder: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    inputClass: PropTypes.string
};
LoginCheckbox.defaultProps = {
    placeholder: false,
    id: "inputCheckbox-" + Math.random(),
    label: "Checkbox",
    inputClass: null
};

export default LoginCheckbox;
