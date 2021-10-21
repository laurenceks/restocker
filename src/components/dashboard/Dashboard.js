import {useEffect, useRef, useState} from 'react';
import DashboardStatTile from "./DashboardStatTile";
import {
    BsBoxArrowInRight,
    BsBoxArrowLeft, HiCheck, HiChevronDoubleDown, HiChevronDoubleUp, HiChevronDown, HiChevronUp,
    HiFire,
    IoAlarmOutline,
    IoWarningOutline,
    MdShowChart
} from "react-icons/all";
import DashboardActionButton from "./DashboardActionButton";
import fetchJson from "../../functions/fetchJson";
import Table from "../common/tables/Table";
import naturalSort from "../../functions/naturalSort";
import {Doughnut, Line} from "react-chartjs-2";
import {bootstrapVariables, commonChartOptions} from "../common/styles";
import deepmerge from "deepmerge";

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
            this.items = {};
            this.itemsStats = {
                outOfStock: 0,
                belowWarningLevel: 0,
                totalStock: 0,
                inStock: 0,
                totalItems: 0
            }
            this.itemsList = [];
            this.itemsRows = [];
            this.tileClasses = {
                stockLevel: "good",
                burnRate: "good",
                outOfStock: "good",
                belowWarningLevel: "good",
            };
            this.chartData = {
                line: {
                    data: {inStock: [], warningLevel: [], outOfStock: []},
                    labels: []
                },
            }
        }
    }

    const [dashboardData, setDashboardData] = useState(new dashboardDataTemplate());

    const dashboardRanges = {
        burn: [
            {
                upper: 0.8,
                colourClass: "bad",
                tableClass: "table-danger",
                textClass: "text-danger",
                icon: <HiChevronDoubleDown/>
            },
            {
                lower: 0.8,
                upper: 0.95,
                colourClass: "ok",
                tableClass: "table-warning",
                textClass: "text-warning",
                icon: <HiChevronDown/>
            },
            {
                lower: 0.95,
                upper: 1,
                colourClass: "good",
                tableClass: "table-success",
                textClass: "text-success",
                icon: <HiCheck/>
            },
            {
                lower: 1,
                upper: 1.05,
                colourClass: "ok",
                tableClass: "table-warning",
                textClass: "text-warning",
                icon: <HiChevronUp/>
            },
            {
                lower: 1.05,
                colourClass: "bad",
                tableClass: "table-danger",
                textClass: "text-danger",
                icon: <HiChevronDoubleUp/>
            },
        ],
        douse: [
            {
                upper: 0.9,
                colourClass: "bad",
                tableClass: "table-danger",
                textClass: "text-danger",
                icon: <HiChevronDoubleDown/>
            },
            {
                lower: 0.9,
                upper: 1,
                colourClass: "ok",
                tableClass: "table-warning",
                textClass: "text-warning",
                icon: <HiChevronDown/>
            },
            {
                lower: 1,
                upper: 1.1,
                colourClass: "good",
                tableClass: "table-success",
                textClass: "text-success",
                icon: <HiCheck/>
            },
            {
                lower: 1.1,
                upper: 1.25,
                colourClass: "ok",
                tableClass: "table-warning",
                textClass: "text-warning",
                icon: <HiChevronUp/>
            },
            {
                lower: 1.25,
                colourClass: "bad",
                tableClass: "table-danger",
                textClass: "text-danger",
                icon: <HiChevronDoubleUp/>
            },
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
        return result && classType === "all" ? result : result[classType] ? result[classType] : null;
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
                    newDashboardData.itemsStats.inStock += newItemData.outOfStock || newItemData.belowWarningLevel ? 0 : 1;
                    newDashboardData.itemsStats.outOfStock += newItemData.outOfStock ? 1 : 0;
                    newDashboardData.itemsStats.belowWarningLevel += newItemData.belowWarningLevel ? 1 : 0;
                    newDashboardData.items[x.itemId] = newItemData;
                    newDashboardData.itemsList.push(newItemData);
                    const newItemDataClasses = {
                        burn: getRangeClass(newItemData.burnRate, dashboardRanges.burn, "all"),
                        douse: getRangeClass(newItemData.douseRate, dashboardRanges.douse, "all")
                    }
                    newDashboardData.itemsRows.push([newItemData.name, {
                        text: newItemData.stockString,
                        className: newItemData.currentStock === 0 ? "text-danger" : newItemData.belowWarningLevel ? "text-warning" : null
                    },
                        newItemData.burnRate ?
                            {
                                text: <><span
                                    className={newItemDataClasses.burn.textClass + " me-1"}>{newItemDataClasses.burn.icon}</span>{newItemData.burnRate.toFixed(3)}</>
                            } : {
                                className: "table-light"
                            },
                        newItemData.douseRate ?
                            {
                                text: <><span
                                    className={newItemDataClasses.douse.textClass + " me-1"}>{newItemDataClasses.douse.icon}</span>{newItemData.douseRate.toFixed(3)}</>
                            } : {
                                className: "table-light"
                            }])
                }
            )
            rateCategories.forEach((x) => {
                    newDashboardData.rates.averageRates[x] = (newDashboardData.rates.figureArrays[x].reduce((a, b) => {
                        return (a || 0) + (b || 0);
                    }, 0) / newDashboardData.rates.figureArrays[x].length);
                }
            );
            newDashboardData.tileClasses.burnRate = getRangeClass(newDashboardData.rates.averageRates.burn, dashboardRanges.burn)
            newDashboardData.tileClasses.outOfStock = getRangeClass(newDashboardData.itemsStats.outOfStock / newDashboardData.itemsList.length, dashboardRanges.outOfStock)
            newDashboardData.tileClasses.belowWarningLevel = getRangeClass(newDashboardData.itemsStats.belowWarningLevel / newDashboardData.itemsList.length, dashboardRanges.belowWarningLevel)
            newDashboardData.tileClasses.stockLevel = getRangeClass(newDashboardData.itemsStats.totalStock / newDashboardData.itemsList.reduce((a, b) => {
                    return a + b.warningLevel;
                }
                , 0), dashboardRanges.stockLevel);
            x.chartData.forEach((y) => {
                    newDashboardData.chartData.line.data.inStock.push(y.stockOnDate);
                    newDashboardData.chartData.line.labels.push(new Date(y.date).toLocaleDateString("default", {weekday: "short"}));
                    let outOfStockOnThisDate = 0;
                    let belowWarningLevelOnThisDate = 0;
                    x.chartItemData.filter(el => el.date === y.date).forEach((el) => {
                        outOfStockOnThisDate += el.stockOnDate === 0 ? 1 : 0;
                        belowWarningLevelOnThisDate += el.stockOnDate !== 0 && el.stockOnDate <= newDashboardData.items[el.itemId]?.warningLevel ? 1 : 0;
                    })
                    newDashboardData.chartData.line.data.outOfStock.push(outOfStockOnThisDate);
                    newDashboardData.chartData.line.data.warningLevel.push(belowWarningLevelOnThisDate);
                }
            );
            setDashboardData(newDashboardData)
        });
    }

    useEffect(() => {
            getRateData();
        }
        , []);

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
                    <div className="d-flex align-items-center justify-content-center rounded bg-light px-3 py-2"
                         style={{height: "15rem"}}>
                        <Line data={{
                            datasets: [{
                                label: "Fully in stock",
                                data: dashboardData.chartData.line.data.inStock,
                                backgroundColor: bootstrapVariables.green,
                                borderColor: bootstrapVariables.green
                            }, {
                                label: "Below warning level",
                                data: dashboardData.chartData.line.data.warningLevel,
                                backgroundColor: bootstrapVariables.yellow,
                                borderColor: bootstrapVariables.yellow
                            }, {
                                label: "Out of stock",
                                data: dashboardData.chartData.line.data.outOfStock,
                                backgroundColor: bootstrapVariables.red,
                                borderColor: bootstrapVariables.red
                            }],
                            labels: dashboardData.chartData.line.labels
                        }}
                              options={deepmerge(commonChartOptions, {
                                  elements: {
                                      line: {tension: 0.35, capBezierPoints: false},
                                      point: {radius: 1, hitRadius: 5, hoverRadius: 4}
                                  },
                                  scales: {
                                      x: {grid: {display: false}}, y: {
                                          afterDataLimits(scale) {
                                              const grace = (scale.max - scale.min) * 0.05;
                                              scale.max += grace;
                                              scale.min -= grace;
                                          }
                                      }
                                  }
                              })}/>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center justify-content-center rounded bg-light px-3 py-2"
                         style={{height: "15rem"}}>
                        <Doughnut data={{
                            datasets: [{
                                data: [dashboardData.itemsStats.inStock, dashboardData.itemsStats.belowWarningLevel, dashboardData.itemsStats.outOfStock],
                                backgroundColor: [bootstrapVariables.green, bootstrapVariables.yellow, bootstrapVariables.red],
                                borderColor:bootstrapVariables.light
                            }],
                            labels: ["Fully in stock",
                                "Below warning level",
                                "Out of stock"]
                        }} options={{maintainAspectRatio: false, cutout: 75, plugins: {legend: {display: false}}}}/>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <div className="col">
                    <div className="d-flex align-items-center justify-content-center">
                        <Table headers={["Name", "Current stock", "Burn rate", "Douse rate"]}
                               rows={dashboardData.itemsRows.sort((a, b) => {
                                   // return a[2] > b[2] ? -1 : 1;
                                   naturalSort(a, b, 2)
                               }).slice(0, 5)} fullWidth/>
                    </div>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes =
    {}
;

export default Dashboard;
