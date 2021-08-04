import React from 'react';
import PropTypes from 'prop-types';

const LoginFeedback = ({feedbackClass, feedbackText}) => {
    return (
        <div>
            <p className={`p-3 mt-3 rounded text-light ${feedbackClass}`}>{feedbackText}</p>
        </div>
    );
};

LoginFeedback.propTypes = {
    feedbackClass: PropTypes.string,
    feedbackText: PropTypes.string
};

LoginFeedback.defaultProps = {
    feedbackClass: "bg-danger",
    feedbackText: "An unknown error occurred"
}

export default LoginFeedback;
