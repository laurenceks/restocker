import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from "react-router-dom";

const LoginLink = ({to, label}) => {
    return (
        <div className={"my-3"}>
            <p className={"small"}><NavLink className={"text-muted"} to={to}>{label}</NavLink></p>
        </div>
    );
};

LoginLink.propTypes = {
    to: PropTypes.string,
    label: PropTypes.string
};

LoginLink.defaultProps = {
    to: "/",
    label: "Home"
}

export default LoginLink;
