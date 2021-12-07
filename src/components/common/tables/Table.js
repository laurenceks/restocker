import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import TableCell from "./TableCell";
import naturalSort from "../../../functions/naturalSort";

const Table = ({
                   title,
                   headers,
                   rows,
                   tableClassName,
                   fullWidth,
                   rowEnter,
                   rowLeave,
                   defaultSortHeading,
                   defaultSortIndex,
                    sortTable
               }) => {

    const headerIndex = headers.findIndex((x) => (x.text || x) === defaultSortHeading);
    const [sortSettings, setSortSettings] = useState({
        index: headerIndex >= 0 ? headerIndex : defaultSortIndex || 0,
        ascending: true
    });
    const [tableRows, setTableRows] = useState(rows);

    useEffect(() => {
        if (sortTable) {
            const returnArray = [...rows].sort((a, b) => naturalSort(a[sortSettings.index].text || a[sortSettings.index], b[sortSettings.index].text || b[sortSettings.index]))
            setTableRows(sortSettings.ascending ? returnArray : returnArray.reverse());
        }else{
            setTableRows(rows)
        }
    }, [sortSettings, rows]);


    return (
        <div className={`table-responsive ${fullWidth && "w-100"}`}>
            {(rows && rows.length > 0) ?
                <table className={`table table-hover ${tableClassName}`}>
                    <thead>
                    <tr>
                        {headers.map((x, i) => {
                            if (x) {
                                return (<th key={`${title}-th-${i}`}
                                            colSpan={x.colspan}
                                            rowSpan={x.rowspan}
                                            className={`${sortTable && "cursor-pointer user-select-none"} ${x.className}`}
                                            onClick={() => {
                                                setSortSettings(prevState => {
                                                    return {
                                                        ascending: i === prevState.index ? !prevState.ascending : true,
                                                        index: i
                                                    }
                                                })
                                            }}
                                >
                                    {x.text || x}</th>)
                            }
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {tableRows.map((x, i) => {
                        return (
                            <tr key={`${title}-tr-${i}`} onMouseEnter={rowEnter} onMouseLeave={rowLeave}>
                                {x.map((y, j) => {
                                    if (y || y === 0) {
                                        return <TableCell key={`${title}-tr-${i}-td-${j}`}
                                                          content={y}
                                                          className={y?.className}
                                                          align={y?.cellAlignClass}
                                        />
                                    }
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
    defaultSortHeading: PropTypes.string,
    title: PropTypes.string,
    tableClassName: PropTypes.string,
    headers: PropTypes.array,
    rows: PropTypes.array,
    fullWidth: PropTypes.bool,
    sortTable: PropTypes.bool,
    rowEnter: PropTypes.func,
    rowLeave: PropTypes.func,
    defaultSortIndex: PropTypes.number,
};

Table.defaultProps = {
    defaultSortHeading: null,
    title: "Users",
    tableClassName: null,
    headers: [],
    rows: [],
    fullWidth: false,
    sortTable: true,
    rowEnter: null,
    rowLeave: null,
    defaultSortIndex: 0,
}

export default Table;
