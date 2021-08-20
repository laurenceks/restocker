import React from 'react';
import PropTypes from 'prop-types';
import UsersTable from "./UsersTable";

const UsersTableSection = ({title, data}) => {
    return (
        <div className="my-3">
            <h3>{title}</h3>
            <UsersTable title={"Active users"} headers={data.headers} rows={data.rows}/>
        </div>
    );
};

UsersTableSection.propTypes = {

};

export default UsersTableSection;
