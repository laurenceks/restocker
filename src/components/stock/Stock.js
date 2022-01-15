import TableSection from "../common/tables/TableSection";
import {useEffect, useState} from "react";
import fetchAllItems from "../../functions/fetchAllItems";
import naturalSort from "../../functions/naturalSort";
import formatMySqlTimestamp from "../../functions/formatMySqlTimestamp";

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

    const [stockList, setStockList] = useState(new stockTableTemplate());

    const getItems = () => {
        fetchAllItems(processItems)
    }

    const processItems = (x) => {
        //TODO remodel data structure to use sort properly
        const newStockList = new stockTableTemplate();
        x.items.map((x) => {
            return {...x, sortKey: "name"}
        }).sort(naturalSort).forEach((item) => {
                newStockList.all.rows.push(
                    [
                        item.id,
                        item.name,
                        `${item.currentStock} ${item.unit}`,
                        `${item.warningLevel} ${item.unit}`,
                        {text: formatMySqlTimestamp(item.lastUpdated), sortValue: item.lastUpdated}
                    ]
                );
                if (item.currentStock === 0) {
                    newStockList.outOfStock.rows.push(
                        [
                            item.id,
                            item.name,
                            `${item.currentStock} ${item.unit}`,
                            `${item.warningLevel} ${item.unit}`,
                            {text: formatMySqlTimestamp(item.lastUpdated), sortValue: item.lastUpdated}
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
                                {text: formatMySqlTimestamp(item.lastUpdated), sortValue: item.lastUpdated}
                            ]
                        );
                    } else {
                        newStockList.inStock.rows.push(
                            [
                                item.id,
                                item.name,
                                `${item.currentStock} ${item.unit}`,
                                `${item.warningLevel} ${item.unit}`,
                                {text: formatMySqlTimestamp(item.lastUpdated), sortValue: item.lastUpdated}
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
            <TableSection title={"All stock"} tableProps={stockList.all}/>
            <TableSection title={"Fully in stock"} tableProps={stockList.inStock}/>
            <TableSection title={"Below warning level"} tableProps={stockList.belowWarningLevel}/>
            <TableSection title={"Out of stock"} tableProps={stockList.outOfStock}/>
            {/*<TableSection title={"Load lists"} tableProps={stockList.list}/>*/}
        </>
    );
};

export default Stock;
