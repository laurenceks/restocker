<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";

$output = array("rateData" => array());
if (property_exists($_SESSION["user"],"ratePeriod")) {
    $output["ratePeriod"] = $_SESSION["user"]->ratePeriod;
    $getRates = $db->prepare("SELECT t0.id AS `itemId`, t0.name, t0.unit, t0.currentStock, t0.warningLevel, t1.days, t1.lastTransaction, t2.withdrawn, t3.restocked, ABS(t2.withdrawn/:ratePeriod) AS `withdrawRate`, ABS(t3.restocked/:ratePeriod) AS `restockRate`, ABS(t2.withdrawn/t3.restocked) AS `burnRate`, ABS(t3.restocked/t2.withdrawn) AS `douseRate` FROM `items` t0

LEFT JOIN (SELECT *, `itemId` AS id1, DATEDIFF(NOW(), (MIN(timestamp))) AS `days`, MAX(timestamp) AS `lastTransaction` FROM `transactions` WHERE `timestamp` >= (NOW() - INTERVAL :ratePeriod DAY) GROUP BY `itemId`) t1 ON t0.id = t1.id1

LEFT JOIN (SELECT `itemId` AS id2, CAST(SUM(quantity) AS INTEGER) AS `withdrawn` FROM `transactions` WHERE `quantity` < 0 AND `timestamp` >= (NOW() - INTERVAL :ratePeriod DAY) GROUP BY `itemId`) t2 ON t1.itemId = t2.id2

LEFT JOIN (SELECT `itemId` AS id3, CAST(SUM(quantity) AS INTEGER) AS `restocked` FROM `transactions` WHERE `quantity` > 0 AND `timestamp` >= (NOW() - INTERVAL :ratePeriod DAY) GROUP BY `itemId`) t3 ON t1.itemId = t3.id3

WHERE t0.deleted = 0 AND t0.organisationId = 1;");

    $getRates->bindValue($_SESSION["user"]->ratePeriod);
} else {
    $getRates = $db->prepare("SELECT t0.id AS `itemId`, t0.name, t0.unit, t0.currentStock, t0.warningLevel, t1.days, t1.lastTransaction, t2.withdrawn, t3.restocked, ABS(t2.withdrawn/t1.days) AS `withdrawRate`, ABS(t3.restocked/t1.days) AS `restockRate`, ABS(t2.withdrawn/t3.restocked) AS `burnRate`, ABS(t3.restocked/t2.withdrawn) AS `douseRate` FROM `items` t0
    
LEFT JOIN (SELECT *, `itemId` AS id1, DATEDIFF(NOW(), MIN(timestamp)) AS `days`, MAX(timestamp) AS `lastTransaction` FROM `transactions` GROUP BY `itemId`) t1 ON t0.id = t1.id1
    
LEFT JOIN (SELECT `itemId` AS id2, CAST(SUM(quantity) AS INTEGER) AS `withdrawn` FROM `transactions` WHERE `quantity` < 0 GROUP BY `itemId`) t2 ON t1.itemId = t2.id2
    
LEFT JOIN (SELECT `itemId` AS id3, CAST(SUM(quantity) AS INTEGER) AS `restocked` FROM `transactions` WHERE `quantity` > 0 GROUP BY `itemId`) t3 ON t1.itemId = t3.id3
    
WHERE t0.deleted = 0 AND t0.organisationId = :organisationId");
}

$getRates->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getRates->execute();
$output["rateData"] = $getRates->fetchAll(PDO::FETCH_ASSOC);

$getChartData = $db->prepare("SELECT b.date, CAST(SUM(a.quantity) AS INTEGER) AS stockOnDate
FROM (
 SELECT DATE(ADDDATE(DATE_SUB(NOW(),INTERVAL 6 DAY), t3*1000 + t2*100 + t1*10 + t0)) AS `date` 
       FROM (SELECT 0 t0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
            (SELECT 0 t1 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
            (SELECT 0 t2 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2,
            (SELECT 0 t3 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t3
) b 
LEFT JOIN transactions a ON DATE(a.timestamp) <= b.date
WHERE b.date BETWEEN DATE(NOW()) - INTERVAL 6 DAY AND DATE(NOW())
AND a.organisationId = :organisationId
GROUP BY b.date
ORDER BY b.date ASC");

$getChartData->bindValue(":organisationId", $_SESSION["user"]->organisationId);
$getChartData->execute();
$output["chartData"] = $getChartData->fetchAll(PDO::FETCH_ASSOC);

$getChartItemData = $db->prepare("SELECT b.date, a.itemId, CAST(SUM(a.quantity) AS INTEGER) AS stockOnDate
FROM (
 SELECT DATE(ADDDATE(DATE_SUB(NOW(),INTERVAL 6 DAY), t3*1000 + t2*100 + t1*10 + t0)) AS `date` 
       FROM (SELECT 0 t0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
            (SELECT 0 t1 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
            (SELECT 0 t2 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2,
            (SELECT 0 t3 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t3
) b 
LEFT JOIN transactions a ON DATE(a.timestamp) <= b.date
WHERE b.date BETWEEN DATE(NOW()) - INTERVAL 6 DAY AND DATE(NOW())
AND a.organisationId = :organisationId
GROUP BY a.itemID, b.date
ORDER BY b.date ASC");

$getChartItemData->bindValue(":organisationId", $_SESSION["user"]->organisationId);
$getChartItemData->execute();
$output["chartItemData"] = $getChartItemData->fetchAll(PDO::FETCH_ASSOC);


//$getChartData = "SELECT id, itemId, date(timestamp) as date, quantity, (SELECT SUM(quantity) FROM transactions WHERE itemId = t.itemId AND id <= t.id) AS cumulativeTotal FROM transactions t WHERE t.timestamp > DATE_ADD(NOW(), INTERVAL -1 MONTH) AND organisationId = 1 ORDER BY t.itemid, t.timestamp";

echo json_encode($output);

//";

//    SELECT *,
//
//DATEDIFF(NOW(), MIN(timestamp)) AS `days`,
//
//(SELECT SUM(quantity) FROM `transactions` WHERE `quantity` < 0 AND `itemId` = `itemId`) AS `totalWithdrawn`,
//
//(SELECT SUM(quantity) FROM `transactions` WHERE `quantity` > 0 AND `itemId` = `itemId`) AS `totalRestocked`,
//
//(SELECT SUM(quantity) FROM `transactions` WHERE `quantity` < 0 AND `itemId` = `itemId`)/DATEDIFF(NOW(), MIN(timestamp)) AS `withdrawDailyRate`,
//
//(SELECT SUM(quantity) FROM `transactions` WHERE `quantity` > 0 AND `itemId` = `itemId`)/DATEDIFF(NOW(), MIN(timestamp)) AS `restock daily rate`,
//
//((SELECT SUM(quantity) FROM `transactions` WHERE `quantity` < 0 AND `itemId` = `itemId`)/DATEDIFF(NOW(), MIN(timestamp)))/((SELECT SUM(quantity) FROM `transactions` WHERE `quantity` > 0 AND `itemId` = `itemId`)/DATEDIFF(NOW(), MIN(timestamp))) AS `burnRate`,
//
//((SELECT SUM(quantity) FROM `transactions` WHERE `quantity` > 0 AND `itemId` = `itemId`)/DATEDIFF(NOW(), MIN(timestamp)))/((SELECT SUM(quantity) FROM `transactions` WHERE `quantity` < 0 AND `itemId` = `itemId`)/DATEDIFF(NOW(), MIN(timestamp))) AS `restockRate`
//
//FROM `transactions` WHERE `organisationId` = 1 GROUP BY `itemId`;")
