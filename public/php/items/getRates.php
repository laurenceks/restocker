<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";

$output = array("rateData" => array());
$getRates = $db->prepare("SELECT t0.id AS `itemId`, t0.name, t0.unit, t0.currentStock, t0.warningLevel, t1.days, t1.lastTransaction, t2.withdrawn, t3.restocked FROM `items` t0

LEFT JOIN (SELECT *, `itemId` AS id1, DATEDIFF(NOW(), MIN(timestamp)) AS `days`, MAX(timestamp) AS `lastTransaction` FROM `transactions` GROUP BY `itemId`) t1 ON t0.id = t1.id1

LEFT JOIN (SELECT `itemId` AS id2, CAST(SUM(quantity) AS INTEGER) AS `withdrawn` FROM `transactions` WHERE `quantity` < 0 GROUP BY `itemId`) t2 ON t1.itemId = t2.id2

LEFT JOIN (SELECT `itemId` AS id3, CAST(SUM(quantity) AS INTEGER) AS `restocked` FROM `transactions` WHERE `quantity` > 0 GROUP BY `itemId`) t3 ON t1.itemId = t3.id3

WHERE t0.deleted = 0 AND t0.organisationId = :organisationId");

$getRates->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getRates->execute();
$output["rateData"] = $getRates->fetchAll(PDO::FETCH_ASSOC);

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
