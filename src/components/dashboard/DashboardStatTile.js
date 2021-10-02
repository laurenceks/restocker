import React from 'react';
import PropTypes from 'prop-types';

const DashboardStatTile = ({title, number, colourClass, isNotInBootstrapGrid, icon}) => {
    const classMap = {
        "good": {
            bg: "bg-success",
            text: "text-light"
        },
        "ok": {
            bg: "bg-warning",
            text: "text-dark"
        },
        "bad": {
            bg: "bg-danger",
            text: "text-light"
        },
    }
    return (
        <div className={`${!isNotInBootstrapGrid && "col"} flex-grow-1 flex-shrink-0 }`}>
            <div className={`d-flex align-bottom rounded ${classMap[colourClass].bg} dashboardStatTileContainer px-2 py-1 position-relative`}>
                <div className="d-flex flex-grow-0 align-items-end dashboardStatTileTitleWrap">
                    <p className={`fs-4 text-end lh-1 py-1 m-0 ${classMap[colourClass].text} dashboardStatTileTitle`}>{title}</p>
                </div>
                <div className="d-flex flex-grow-1 align-items-end">
                    <p className={`m-0 text-center lh-1 w-100 dashboardStatTileNumber ${classMap[colourClass].text}`}>{number}</p>
                </div>
                {icon && <div className="dashboardStatTileIconContainer">
                    {icon}
                </div>}
            </div>
        </div>
    );
};

DashboardStatTile.propTypes = {
    title: PropTypes.string,
    number: PropTypes.string,
    colourClass: PropTypes.string,
    isNotInBootstrapGrid: PropTypes.bool,
    icon: PropTypes.elementType
};
DashboardStatTile.defaultProps = {
    title: "",
    number: "",
    colourClass: "",
    isNotInBootstrapGrid: false,
    icon: null
};

export default DashboardStatTile;