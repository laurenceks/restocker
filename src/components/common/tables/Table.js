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
                   allowSorting,
                   length
               }) => {

    const headerIndex = headers.findIndex((x) => (x.text || x) === defaultSortHeading);
    const [sortSettings, setSortSettings] = useState({
        index: headerIndex >= 0 ? headerIndex : defaultSortIndex || 0,
        ascending: true
    });
    const [tableRows, setTableRows] = useState(rows);
    const columnCount = useRef(headers.reduce((a, b) => a += b.colspan || 1, 0));

    const sortTableRows = (a, b) => {
        const aIndex = sortSettings.index + (columnCount.current - a.length);
        const bIndex = sortSettings.index + (columnCount.current - b.length);
        naturalSort(a[aIndex]?.sortValue || a[aIndex]?.text || a[aIndex]?.props?.defaultValue || a[aIndex], b[bIndex]?.sortValue || b[bIndex]?.text || b[bIndex]?.props?.defaultValue || b[bIndex]);
    };

    useEffect(() => {
        let sortedRows = [...rows];
        if (allowSorting) {
            if (sortedRows.some(x => x[sortSettings.index]?.rowspan)) {
                let newSortArray = [];
                while (sortedRows.length > 0) {
                    newSortArray.push(sortedRows.splice(0, sortedRows[0]?.[0]?.rowspan || 1))
                }
                newSortArray = newSortArray.sort(sortTableRows);
                newSortArray = sortSettings.ascending ? newSortArray : newSortArray.reverse();
                newSortArray = !length ? newSortArray : newSortArray.splice(0, length);
                sortedRows = [];
                newSortArray.forEach((x) => {
                    sortedRows.push(...x)
                });
            } else {
                sortedRows = [...rows].sort(sortTableRows);
                sortedRows = sortSettings.ascending ? sortedRows : sortedRows.reverse();
            }
        }
        sortedRows = !length ? sortedRows : sortedRows.splice(0, length);
        setTableRows(sortedRows);
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
                                            className={`${allowSorting && "cursor-pointer user-select-none"} ${x.className}`}
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
    allowSorting: PropTypes.bool,
    rowEnter: PropTypes.func,
    rowLeave: PropTypes.func,
    defaultSortIndex: PropTypes.number,
    length: PropTypes.number,
};

Table.defaultProps = {
    defaultSortHeading: null,
    title: "Users",
    tableClassName: null,
    headers: [],
    rows: [],
    fullWidth: false,
    allowSorting: true,
    rowEnter: null,
    rowLeave: null,
    defaultSortIndex: 0,
    length: null
}

export default Table;
