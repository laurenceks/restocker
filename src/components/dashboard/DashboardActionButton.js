import PropTypes from 'prop-types';
import {useHistory} from "react-router-dom";

const DashboardStatTile = ({text, type, link, colour, icon, isNotInBootstrapGrid}) => {
    const history = useHistory();
    return (
        <div className={`${!isNotInBootstrapGrid && "col"} flex-grow-1 flex-shrink-0 }`}>
            <button className={`btn dashboardActionButton ${!isNotInBootstrapGrid && "w-100"} ${colour}`}
                    onClick={(e) => {
                        if (type === "link" && link) {
                            history.push(link);
                        }
                    }}>
                <div className="d-flex justify-content-center align-items-center">
                    {icon && icon}
                    <div>{text}</div>
                </div>
            </button>
        </div>
    );
};

DashboardStatTile.propTypes = {
    link: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    colour: PropTypes.string,
    isNotInBootstrapGrid: PropTypes.bool,
    icon: PropTypes.elementType
};
DashboardStatTile.defaultProps = {
    text: "",
    colour: "btn-outline-primary",
    isNotInBootstrapGrid: false,
    icon: null,
    link: null,
    type: null,
};

export default DashboardStatTile;
