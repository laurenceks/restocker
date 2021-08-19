import React from 'react';
import PropTypes from 'prop-types';
import {IoCheckmarkCircleSharp, IoCloseCircle, IoCloseCircleSharp} from "react-icons/all";

const renderCellContent = (x) => {
    if (!x.type) {
        return x;
    } else {
        switch (x.type) {
            case "tick":
                return (
                    <span className={`tableIcon ${x.value ? "text-success" : "text-danger"}`}>
                        {x.value ? <IoCheckmarkCircleSharp/> :
                            <IoCloseCircleSharp/>}
                    </span>
                )
            case "button":
                return (
                    <button className={`btn ${x.buttonClass}`} onClick={x.handler} data-userid={x.id}>{x.text}</button>
                )
            default:
                return x.text || "";
        }
    }
}

const UsersTable = ({title, headers, rows}) => {
    return (
        <>{(rows && rows.length > 0) ?
            <table className="table table-responsive">
                <tbody>
                <tr>
                    {headers.map((x, i) => {
                        return (<th key={`${title}-th-${i}`}
                                    colSpan={x.colspan}
                                    className={x.className}>
                            {x.text || x}</th>);
                    })}
                </tr>
                {rows.map((x, i) => {
                    return (
                        <tr key={`${title}-tr-${i}`}>
                            {x.map((y, j) => {
                                return (<td key={`${title}-tr-${i}-td-${j}`}
                                            className={y.className || ""}>{renderCellContent(y)}</td>)
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            :
            <p className="p-3 my-3 bg-light text-dark rounded-3 text-center">No data to display</p>}</>
    );
};

UsersTable.propTypes = {
    title: PropTypes.string,
    headers: PropTypes.array,
    rows: PropTypes.array
};

UsersTable.defaultProps = {
    title: "Users",
    headers: [],
    rows: []
}

export default UsersTable;