import PropTypes from 'prop-types';
import TableCell from "./TableCell";

const Table = ({title, headers, rows, tableClassName, fullWidth, rowEnter, rowLeave}) => {
    return (
        <div className={`table-responsive ${fullWidth && "w-100"}`}>{(rows && rows.length > 0) ?
            <table className={`table table-hover ${tableClassName}`}>
                <thead>
                <tr>
                    {headers.map((x, i) => {
                        if (x) {
                            return (<th key={`${title}-th-${i}`}
                                        colSpan={x.colspan}
                                        rowSpan={x.rowspan}
                                        className={x.className}>
                                {x.text || x}</th>)
                        }
                    })}
                </tr>
                </thead>
                <tbody>
                {rows.map((x, i) => {
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
    title: PropTypes.string,
    tableClassName: PropTypes.string,
    headers: PropTypes.array,
    rows: PropTypes.array,
    fullWidth: PropTypes.bool,
    rowEnter: PropTypes.func,
    rowLeave: PropTypes.func
};

Table.defaultProps = {
    title: "Users",
    tableClassName: null,
    headers: [],
    rows: [],
    fullWidth: false,
    rowEnter: null,
    rowLeave: null
}

export default Table;
