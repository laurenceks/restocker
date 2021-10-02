import React from 'react';
import PropTypes from 'prop-types';
import {IoCodeDownload, IoCodeDownloadSharp} from "react-icons/all";

const DashboardStatTile = ({text, link, colour, icon, isNotInBootstrapGrid}) => {
    return (
        <div className={`${!isNotInBootstrapGrid && "col"} flex-grow-1 flex-shrink-0 }`}>
            <button className={`btn dashboardActionButton ${!isNotInBootstrapGrid && "w-100"} ${colour}`}>
                    <div className="d-flex justify-content-center align-items-center">
                        {icon && icon}
                        <div>{text}</div>
                    </div>
            </button>
        </div>
    );
};

DashboardStatTile.propTypes = {
    text: PropTypes.string,
    colour: PropTypes.string,
    isNotInBootstrapGrid: PropTypes.bool,
    icon: PropTypes.elementType
};
DashboardStatTile.defaultProps = {
    text: "",
    colour: "btn-outline-primary",
    isNotInBootstrapGrid: false,
    icon: null
};

export default DashboardStatTile;
