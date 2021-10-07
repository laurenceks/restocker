import React from 'react';
import PropTypes from 'prop-types';
import Table from "./Table";

const TableSection = ({title, data}) => {
    return (
        <div className="my-3">
            <h3>{title}</h3>
            <Table title={"Active users"} headers={data.headers} rows={data.rows}/>
        </div>
    );
};

TableSection.propTypes = {
    title: PropTypes.string,
    data: PropTypes.object
};

TableSection.defaultProps = {
    title: "Table",
    data: null
};

export default TableSection;
