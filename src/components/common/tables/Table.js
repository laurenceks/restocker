import React from 'react';
import PropTypes from 'prop-types';
import {IoCheckmarkCircleSharp, IoCloseCircleSharp} from "react-icons/all";
import LoginInput from "../forms/LoginInput";
import TableCell from "./TableCell";

const renderCellContent = (x) => {
    if (!x.type) {
        return typeof x === "string" || typeof x === "number" ? x : "";
    } else {
        switch (x.type) {
            case "tick":
            case "tick-invert":
                return (
                    <span
                        className={`tableIcon ${x.type !== "tick-invert" ? (x.value ? "text-success" : "text-danger") : !x.value ? "text-success" : "text-danger"}`}>
                        {x.value ? <IoCheckmarkCircleSharp/> :
                            <IoCloseCircleSharp/>}
                    </span>
                )
            case "button":
            case "submit":
                return (
                    <button type={x.type==="submit" && "submit"} className={`btn ${x.buttonClass || "btn-primary"}`} onClick={x.handler} data-userid={x.id}>{x.text}</button>
                )
            case "input":
                return (
                    <LoginInput {...x.props}/>
                )
            default:
                return x.text || "";
        }
    }
}

const Table = ({title, headers, rows}) => {
    return (
        <div className="table-responsive">{(rows && rows.length > 0) ?
            <table className="table table-hover">
                <thead>
                <tr>
                    {headers.map((x, i) => {
                        return (<th key={`${title}-th-${i}`}
                                    colSpan={x.colspan}
                                    className={x.className}>
                            {x.text || x}</th>);
                    })}
                </tr>
                </thead>
                <tbody>
                {rows.map((x, i) => {
                    return (
                        <tr key={`${title}-tr-${i}`}>
                            {x.map((y, j) => {
                                return <TableCell key={`${title}-tr-${i}-td-${j}`} content={y} className={y.className}/>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            :
            <p className="p-3 my-3 bg-light text-dark rounded-3 text-center">No data to display</p>}</div>
    );
};

Table.propTypes = {
    title: PropTypes.string,
    headers: PropTypes.array,
    rows: PropTypes.array
};

Table.defaultProps = {
    title: "Users",
    headers: [],
    rows: []
}

export default Table;
