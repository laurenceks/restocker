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
                totalStock: 0,
                totalItems: 0
            }
            this.itemsList = [];
            this.itemsRows = [];
            this.tileClasses = {
                stockLevel: "good",
                burnRate: "good",
                outOfStock: "good",
                belowWarningLevel: "good",
            }
        }
    }

    const [dashboardData, setDashboardData] = useState(new dashboardDataTemplate());

    const dashboardRanges = {
        burn: [
            {upper: 0.8, colourClass: "bad", tableClass: "table-danger"},
            {lower: 0.8, upper: 0.95, colourClass: "ok", tableClass: "table-warning"},
            {lower: 0.95, upper: 1, colourClass: "good", tableClass: "table-success"},
            {lower: 1, upper: 1.05, colourClass: "ok", tableClass: "table-warning"},
            {lower: 1.05, colourClass: "bad", tableClass: "table-danger"},
        ],
        douse: [
            {upper: 0.9, colourClass: "bad", tableClass: "table-danger"},
            {lower: 0.9, upper: 1, colourClass: "ok", tableClass: "table-warning"},
            {lower: 1, upper: 1.1, colourClass: "good", tableClass: "table-success"},
            {lower: 1.1, upper: 1.25, colourClass: "ok", tableClass: "table-warning"},
            {lower: 1.25, colourClass: "bad", tableClass: "table-danger"},
        ],
        stockLevel: [
            {upper: 0.9, colourClass: "bad", tableClass: "table-danger"},
            {lower: 0.9, upper: 0.95, colourClass: "ok", tableClass: "table-warning"},
            {upper: 1, colourClass: "good", tableClass: "table-success"},
        ],
        outOfStock: [
            {upper: 0.05, colourClass: "good", tableClass: "table-success"},
            {lower: 0.05, upper: 0.1, colourClass: "ok", tableClass: "table-warning"},
            {lower: 0.1, colourClass: "bad", tableClass: "table-danger"},
        ],
        belowWarningLevel: [
            {upper: 0.15, colourClass: "good", tableClass: "table-success"},
            {lower: 0.15, upper: 0.2, colourClass: "ok", tableClass: "table-warning"},
            {lower: 0.25, colourClass: "bad", tableClass: "table-danger"},
        ]
    }

    const getRangeClass = (val, range, classType = "colourClass") => {
        const result = range.find((x, i) => {
            if (i === 0) {
                return val < (x.threshold || x.upper)
            } else {
                return (val >= x.lower && val < x.upper) || (val >= x.lower && i === range.length - 1)
            }
        })
        return result && result[classType] ? result[classType] : null;
    }

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
                    stockString: `${x.currentStock} ${x.unit}`,
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
                newDashboardData.itemsRows.push([newItemData.name, {
                    text: newItemData.stockString,
                    className: newItemData.currentStock === 0 ? "table-danger" : newItemData.belowWarningLevel ? "table-warning" : null
                },
                    newItemData.burnRate ?
                        {
                            text: newItemData.burnRate.toFixed(3),
                            className: getRangeClass(newItemData.burnRate, dashboardRanges.burn, "tableClass")
                        } : {
                            className: "table-light"
                        },
                    newItemData.douseRate ?
                        {
                            text: newItemData.douseRate.toFixed(3),
                            className: getRangeClass(newItemData.douseRate, dashboardRanges.douse, "tableClass")
                        } : {
                            className: "table-light"
                        }])
            })
            rateCategories.forEach((x) => {
                newDashboardData.rates.averageRates[x] = (newDashboardData.rates.figureArrays[x].reduce((a, b) => {
                    return (a || 0) + (b || 0);
                }, 0) / newDashboardData.rates.figureArrays[x].length);
            });
            newDashboardData.tileClasses.burnRate = getRangeClass(newDashboardData.rates.averageRates.burn, dashboardRanges.burn)
            newDashboardData.tileClasses.outOfStock = getRangeClass(newDashboardData.itemsStats.outOfStock / newDashboardData.itemsList.length, dashboardRanges.outOfStock)
            newDashboardData.tileClasses.belowWarningLevel = getRangeClass(newDashboardData.itemsStats.belowWarningLevel / newDashboardData.itemsList.length, dashboardRanges.belowWarningLevel)
            newDashboardData.tileClasses.stockLevel = getRangeClass(newDashboardData.itemsStats.totalStock / newDashboardData.itemsList.reduce((a, b) => {
                return a + b.warningLevel;
            }, 0), dashboardRanges.stockLevel);
            setDashboardData(newDashboardData)
        });
    }

    useEffect(() => {
        getRateData();
    }, []);


    return (
        <div className="container">
            <div className="row my-3 gy-3">
                <DashboardStatTile title={"Stock level"}
                                   number={dashboardData.itemsStats.totalStock == 0 ? 0 : dashboardData.itemsStats.totalStock || ""}
                                   colourClass={dashboardData.tileClasses.stockLevel}
                                   icon={<MdShowChart/>}/>
                <DashboardStatTile title={"Burn rate"}
                                   number={dashboardData.rates.averageRates.burn.toFixed(dashboardData.rates.averageRates.burn >= 10 ? 1 : 2) || ""}
                                   colourClass={dashboardData.tileClasses.burnRate}
                                   icon={<HiFire/>}/>
                <DashboardStatTile title={"Out of stock"}
                                   number={dashboardData.itemsStats.outOfStock === 0 ? 0 : dashboardData.itemsStats.outOfStock || ""}
                                   colourClass={dashboardData.tileClasses.outOfStock}
                                   icon={<IoWarningOutline/>}/>
                <DashboardStatTile title={"Restock due"}
                                   number={dashboardData.itemsStats.belowWarningLevel === 0 ? 0 : dashboardData.itemsStats.belowWarningLevel || ""}
                                   colourClass={dashboardData.tileClasses.belowWarningLevel}
                                   icon={<IoAlarmOutline/>}/>
            </div>
            <div className="row my-3 gy-3">
                <DashboardActionButton
                    text={"Withdraw"}
                    icon={<BsBoxArrowLeft/>}
                    colour={"btn-outline-orange"}
                    type={"link"}
                    link={"/withdraw"}
                />
                <DashboardActionButton
                    text={"Restock"}
                    icon={<BsBoxArrowInRight/>}
                    colour={"btn-outline-teal"}
                    type={"link"}
                    link={"/restock"}
                />
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
                               rows={dashboardData.itemsRows.sort((a, b) => {
                                   return a[2] > b[2] ? -1 : 1;
                                   // naturalSort(a, b, 2)
                               }).slice(0, 5)} fullWidth/>
                    </div>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes = {};

export default Dashboard;
