import TableSection from "../common/tables/TableSection";
import {useEffect, useRef, useState} from "react";
import fetchAllItems from "../../functions/fetchAllItems";
import naturalSort from "../../functions/naturalSort";


const Stock = () => {
    const stockTableHeaders = ["ID", "Name", "Current stock", "Warning level", "Last transaction"];

    class stockTableTemplate {
        constructor() {
            this.all = {headers: stockTableHeaders, rows: []};
            this.inStock = {headers: stockTableHeaders, rows: []};
            this.outOfStock = {headers: stockTableHeaders, rows: []};
            this.belowWarningLevel = {headers: stockTableHeaders, rows: []};
            this.Lists = {headers: ["ID", "Name", "Current Stock", "Warning level", "Includes"], rows: []};
        }
    }

    //TODO add sort key to table headers on click
    const [sortKey, setSortKey] = useState("name");
    const [stockList, setStockList] = useState(new stockTableTemplate());

    const getItems = () => {
        fetchAllItems(processItems)
    }

    const processItems = (x) => {
        const newStockList = new stockTableTemplate();
        x.items.map((x) => {
            return {...x, sortKey: x[sortKey]}
        }).sort(naturalSort).forEach((item, index) => {
                newStockList.all.rows.push(
                    [
                        item.id,
                        item.name,
                        `${item.currentStock} ${item.unit}`,
                        `${item.warningLevel} ${item.unit}`,
                        item.lastUpdated
                    ]
                );
                if (item.currentStock === 0) {
                    newStockList.outOfStock.rows.push(
                        [
                            item.id,
                            item.name,
                            `${item.currentStock} ${item.unit}`,
                            `${item.warningLevel} ${item.unit}`,
                            item.lastUpdated
                        ]
                    );
                } else {
                    if (item.currentStock <= item.warningLevel) {
                        newStockList.belowWarningLevel.rows.push(
                            [
                                item.id,
                                item.name,
                                `${item.currentStock} ${item.unit}`,
                                `${item.warningLevel} ${item.unit}`,
                                item.lastUpdated
                            ]
                        );
                    } else {
                        newStockList.inStock.rows.push(
                            [
                                item.id,
                                item.name,
                                `${item.currentStock} ${item.unit}`,
                                `${item.warningLevel} ${item.unit}`,
                                item.lastUpdated
                            ]);
                    }
                }
            }
        )
        setStockList(newStockList);
    }

    useEffect(() => {
        //on initial load fetch item lists
        getItems();
    }, []);

    return (
        <>
            <TableSection title={"All stock"} data={stockList.all}/>
            <TableSection title={"In stock"} data={stockList.inStock}/>
            <TableSection title={"Below warning level"} data={stockList.belowWarningLevel}/>
            <TableSection title={"Out of stock"} data={stockList.outOfStock}/>
            {/*<TableSection title={"Load lists"} data={stockList.list}/>*/}
        </>
    );
};

export default Stock;
