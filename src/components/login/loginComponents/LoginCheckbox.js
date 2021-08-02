import React from 'react';
import PropTypes from 'prop-types';

const LoginInput = ({type, placeholder, id, label, inputClass}) => {
    return (
        <div className="form-floating">
            <input type={type} className={`form-control loginInput${inputClass ? ` ${inputClass}` : ""}`} id={id}
                   placeholder={placeholder}/>
            <label htmlFor={id}>{label}</label>
        </div>
    );
};

LoginInput.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    inputClass: PropTypes.string
};
LoginInput.defaultProps = {
    type: "text",
    placeholder: null,
    id: "floatingLabel" + Math.random(),
    label: "Input",
    inputClass: null
};

export default LoginInput;
