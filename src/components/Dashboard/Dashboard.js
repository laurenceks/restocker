import React from 'react';
import DashboardStatTile from "./DashboardStatTile";
import {
    BsBoxArrowInRight,
    BsBoxArrowLeft,
    HiFire,
    IoAlarmOutline,
    IoWarningOutline,
    MdShowChart
} from "react-icons/all";
import DashboardActionButton from "./DashboardActionButton";

const Dashboard = () => {
    return (
        <div className="container">
            <div className="row my-3 gy-3">
                <DashboardStatTile title={"Stock level"} number={"94"} colourClass={"good"} icon={<MdShowChart/>}/>
                <DashboardStatTile title={"Burn rate"} number={"1.05"} colourClass={"ok"} icon={<HiFire/>}/>
                <DashboardStatTile title={"Out of stock"} number={"3"} colourClass={"bad"} icon={<IoWarningOutline/>}/>
                <DashboardStatTile title={"Restock due"} number={"10"} colourClass={"ok"} icon={<IoAlarmOutline/>}/>
            </div>
            <div className="row my-3 gy-3">
                <DashboardActionButton text={"Withdraw"} icon={<BsBoxArrowLeft/>} colour={"btn-outline-orange"}/>
                <DashboardActionButton text={"Restock"} icon={<BsBoxArrowInRight/>} colour={"btn-outline-teal"}/>
            </div>
            <div className="row my-3 gy-3">
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center justify-content-center rounded bg-light"
                         style={{height: "15rem"}}>
                        <p className="text-dark m-0">Chart 1 - burn rate?</p>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center justify-content-center rounded bg-light"
                         style={{height: "15rem"}}>
                        <p className="text-dark m-0">Chart 2 - stock levels?</p>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <div className="col">
                    <div className="d-flex align-items-center justify-content-center rounded bg-light"
                         style={{height: "15rem"}}>
                        <p className="text-dark m-0">Table</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes = {};

export default Dashboard;
