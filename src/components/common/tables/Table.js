import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import TableCell from "./TableCell";
import naturalSort from "../../../functions/naturalSort";
import {IoArrowDown, IoArrowUp} from "react-icons/all";
import ArrowIconTransition from "../transitions/ArrowIconTransition";

const Table = ({
                   title,
                   headers,
                   rows,
                   maxRowCount,
                   tableClassName,
                   fullWidth,
                   rowEnter,
                   rowLeave,
                   defaultSortHeading,
                   defaultSortIndex,
                   defaultSortDirection,
                   allowSorting,
                   length
               }) => {

    const headerIndex = headers.findIndex((x) => (x.text || x) === defaultSortHeading);
    const [sortSettings, setSortSettings] = useState({
        index: headerIndex >= 0 ? headerIndex : defaultSortIndex || 0,
        ascending: ["descending", "desc", "dsc", "d", "down", "bigToSmall", "largeToSmall", "ZtoA", 0, false].indexOf(defaultSortDirection) === -1,
    });
    const [showSortArrow, setShowSortArrow] = useState(false);
    const [currentHeadingHoverIndex, setCurrentHeadingHoverIndex] = useState(null);
    const [tableRows, setTableRows] = useState(rows);
    const [currentPage, setCurrentPage] = useState(0);
    const columnCount = useRef(headers.reduce((a, b) => a += b.colspan || 1, 0));
    const pageCount = Math.ceil(tableRows.length / maxRowCount) || null;
    const pageNumbers = pageCount ? [...Array(pageCount).keys()].map(x => ++x) : [];

    const sortTableRows = (a, b) => {
        const aIndex = sortSettings.index + (columnCount.current - a.length);
        const bIndex = sortSettings.index + (columnCount.current - b.length);
        return naturalSort(a[aIndex]?.sortValue ?? a[aIndex]?.text ?? a[aIndex]?.props?.defaultValue ?? a[aIndex], b[bIndex]?.sortValue ?? b[bIndex]?.text ?? b[bIndex]?.props?.defaultValue ?? b[bIndex]);
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
                sortedRows = sortedRows.sort(sortTableRows);
                sortedRows = sortSettings.ascending ? sortedRows : sortedRows.reverse();
            }
        }
        sortedRows = !length ? sortedRows : sortedRows.splice(0, length);
        setTableRows(sortedRows);
    }, [sortSettings, rows]);

    return (
        <div className={`table-responsive ${fullWidth && "w-100"}`}>
            {(rows && rows.length > 0) ?
                <>
                    <table className={`table table-hover ${tableClassName}`}>
                        <thead>
                        <tr onMouseEnter={() => setShowSortArrow(true)}
                            onMouseLeave={() => setShowSortArrow(false)}
                        >
                            {headers.map((x, i) => {
                                if (x) {
                                    return (<th key={`${title}-th-${i}`}
                                                colSpan={x.colspan}
                                                rowSpan={x.rowspan}
                                                className={`${allowSorting && " cursor-pointer user-select-none"} ${x.className || ""}`}
                                                data-index={i}
                                                onMouseEnter={(e) => setCurrentHeadingHoverIndex(parseInt(e.target.dataset.index))}
                                                onClick={() => {
                                                    setSortSettings(prevState => {
                                                        return {
                                                            ascending: i === prevState.index ? !prevState.ascending : true,
                                                            index: i
                                                        }
                                                    })
                                                }}
                                    >
                                        <div className="d-flex flex-row align-items-center">
                                            <ArrowIconTransition
                                                in={(showSortArrow && (sortSettings.index === i || currentHeadingHoverIndex === i))}
                                                colourVariant={sortSettings.index !== i && "secondary"}
                                            >
                                                {(sortSettings.ascending ?
                                                    <IoArrowUp
                                                        className="d-block"/> :
                                                    <IoArrowDown className="d-block"/>)}
                                            </ArrowIconTransition>
                                            <div>{x.text || x}</div>
                                        </div>
                                    </th>)
                                }
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {[...tableRows].splice(currentPage * maxRowCount, maxRowCount).map((x, i) => {
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
                    {tableRows.length > maxRowCount &&
                    <nav aria-label="Table pages">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 0 ? "disabled" : "cursor-pointer"}`}>
                                <a className="page-link"
                                   aria-label="Previous"
                                   onClick={() => setCurrentPage(prevState => Math.min(0, --prevState))}
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            {pageNumbers.map((x, i) => {
                                return <li key={`table-${title}-page-${i + 1}`}
                                           className={`page-item  ${currentPage === i ? "disabled" : "cursor-pointer"}`}>
                                    <a className="page-link" onClick={() => setCurrentPage(i)}>{x}</a></li>
                            })}
                            <li className={`page-item ${currentPage === pageCount - 1 ? "disabled" : "cursor-pointer"}`}>
                                <a className="page-link"
                                   aria-label="Next"
                                   onClick={() => setCurrentPage(prevState => Math.min(pageCount - 1, ++prevState))}
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    }
                </>
                :
                <p className=" p-3 my-3 bg-light text-dark rounded-3 text-center">No data to display</p>}
        </div>
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
    maxRowCount: PropTypes.number,
    length: PropTypes.number,
};

Table.defaultProps = {
    defaultSortHeading: null,
    title: `table-${Date.now().toString(36)}`,
    tableClassName: null,
    headers: [],
    rows: [],
    fullWidth: false,
    allowSorting: true,
    rowEnter: null,
    rowLeave: null,
    defaultSortIndex: 0,
    maxRowCount: 10,
    length: null
}

export default Table;
