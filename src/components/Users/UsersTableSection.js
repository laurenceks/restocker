import React from 'react';
import PropTypes from 'prop-types';
import UsersTable from "./UsersTable";

const UsersTableSection = ({title, data}) => {
    return (
        <div className="my-3">
            <h1>{title}</h1>
            <UsersTable title={"Active users"} headers={data.headers} rows={data.rows}/>
        </div>
    );
};

UsersTableSection.propTypes = {

};

export default UsersTableSection;
