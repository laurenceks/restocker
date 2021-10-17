import {useEffect, useRef, useState} from 'react';
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
import fetchAllItems from "../../functions/fetchAllItems";
import fetchJson from "../../functions/fetchJson";
import Table from "../common/tables/Table";
import naturalSort from "../../functions/naturalSort";

const Dashboard = () => {
    class dashboardDataTemplate {
        constructor() {
            this.rates = {
                averageRates: {
                    withdraw: 0,
                    restock: 0,
                    burn: 0,
                    douse: 0
                },
                medianWithdraw: 0,
                medianRestock: 0,
                figureArrays: {
                    withdraw: [],
                    restock: [],
                    burn: [],
                    douse: [],
                },
                allRates: [],
                ratesById: []
            };
            this.itemsStats = {
                outOfStock: 0,
                belowWarningLevel: 0,
                totalStock: 0
            }
            this.itemsList = [];
            this.itemsRows = [];
        }
    }

    const [dashboardData, setDashboardData] = useState(new dashboardDataTemplate());

    const getRateData = () => {
        fetchJson("./php/items/getRates.php", {
            method: "GET"
        }, (x) => {
            const rateCategories = ["withdraw", "restock", "burn", "douse"];
            const newDashboardData = new dashboardDataTemplate();
            x.rateData.forEach((x) => {
                const rateDataForId = {
                    itemId: x.itemId,
                    days: x.days || 0,
                    unit: x.unit,
                    totalRestocked: x.restocked || 0,
                    totalWithdrawn: Math.abs(x.withdrawn) || 0,
                    withdrawRate: (Math.abs(x.withdrawn) / x.days) || 0,
                    restockRate: (x.restocked / x.days) || 0,
                };
                rateDataForId.burnRate = (rateDataForId.withdrawRate / (rateDataForId.restockRate || 1)) || null;
                rateDataForId.douseRate = (rateDataForId.restockRate / (rateDataForId.withdrawRate || 1)) || null;
                newDashboardData.rates.allRates.push(rateDataForId);
                newDashboardData.rates.ratesById[x.itemId] = rateDataForId;
                rateCategories.forEach((x) => {
                    if (rateDataForId[x + "Rate"]) {
                        newDashboardData.rates.figureArrays[x].push(rateDataForId[x + "Rate"]);
                    }
                });
                const newItemData = {
                    id: x.itemId,
                    name: x.name,
                    unit: x.unit,
                    currentStock: x.currentStock,
                    warningLevel: x.warningLevel,
                    outOfStock: x.currentStock === 0,
                    belowWarningLevel: x.currentStock <= x.warningLevel,
                    burnRate: rateDataForId.burnRate,
                    douseRate: rateDataForId.douseRate,
                    withdrawRate: rateDataForId.withdrawRate,
                    restockRate: rateDataForId.restockRate,
                    lastTransaction: x.lastTransaction
                };
                newDashboardData.itemsStats.totalStock += newItemData.currentStock;
                newDashboardData.itemsStats.outOfStock += newItemData.outOfStock ? 1 : 0;
                newDashboardData.itemsStats.belowWarningLevel += newItemData.belowWarningLevel ? 1 : 0;
                newDashboardData.itemsList.push(newItemData);
                newDashboardData.itemsRows.push([newItemData.name, newItemData.currentStock === 0 ? {
                    text: newItemData.currentStock.toString(),
                    className: "table-danger"
                } : newItemData.currentStock, newItemData.burnRate || {
                    className: "table-light"
                }, newItemData.douseRate || {className: "table-light"}])
            })
            rateCategories.forEach((x) => {
                newDashboardData.rates.averageRates[x] = (newDashboardData.rates.figureArrays.withdraw.reduce((a, b) => {
                    return (a || 0) + (b || 0);
                }) / newDashboardData.rates.figureArrays[x].length);
            });
            console.log(newDashboardData.itemsRows)
            setDashboardData(newDashboardData)
        });
    }

    useEffect(() => {
        getRateData();
    }, []);


    return (
        <div className="container">
            <div className="row my-3 gy-3">
                <DashboardStatTile title={"Stock level"} number={dashboardData.itemsStats.totalStock || ""}
                                   colourClass={"good"} icon={<MdShowChart/>}/>
                <DashboardStatTile title={"Burn rate"}
                                   number={dashboardData.rates.averageRates.burn.toFixed(dashboardData.rates.averageRates.burn >= 10 ? 1 : 2) || ""}
                                   colourClass={"ok"} icon={<HiFire/>}/>
                <DashboardStatTile title={"Out of stock"} number={dashboardData.itemsStats.outOfStock || ""}
                                   colourClass={"bad"} icon={<IoWarningOutline/>}/>
                <DashboardStatTile title={"Restock due"} number={dashboardData.itemsStats.belowWarningLevel || ""}
                                   colourClass={"ok"} icon={<IoAlarmOutline/>}/>
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
                    <div className="d-flex align-items-center justify-content-center">
                        <Table headers={["Name", "Current stock", "Burn rate", "Douse rate"]}
                               rows={dashboardData.itemsRows.sort(naturalSort)} fullWidth/>
                    </div>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes = {};

export default Dashboard;
