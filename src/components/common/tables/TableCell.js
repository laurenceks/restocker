import PropTypes from 'prop-types';
import {IoCheckmarkCircleSharp, IoCloseCircleSharp} from "react-icons/all";
import FormInput from "../forms/FormInput";

const renderCellContent = (x) => {
    if (!x.type) {
        return typeof x === "string" || typeof x === "number" ? x : x.text || "";
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
                    <button type={x.type === "submit" ? "submit" : "button"}
                            form={x.type === "submit" && x.form ? x.form : ""}
                            className={`btn ${x.buttonClass || "btn-primary"}`} onClick={x.handler}
                            data-userid={x.id}>{x.text}</button>
                )
            case "input":
                return (
                    <FormInput {...x.props}/>
                )
            default:
                return x.text || "";
        }
    }
}

const TableCell = ({className, content, align}) => {
    return (
        <td className={`${align && align + " "} ${className || ""}`}
            colSpan={content.colspan}
            rowSpan={content.rowspan}
            {...content.cellData}
        >
            {content || content === 0 ? content.fragment || renderCellContent(content) : ""}
        </td>
    );
};

TableCell.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    align: PropTypes.string,
};

TableCell.defaultProps = {
    title: "Users",
    className: "",
    align: "align-middle"
}

export default TableCell;
