<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";

$output = array("rateData" => array(), "success" => false, "feedback" => "An unknown error occurred");
$input = json_decode(file_get_contents('php://input'), true);

$validLocation = isset($input["locationId"]) && is_int($input["locationId"]);
$validRatePeriod = isset($input["ratePeriod"]) && is_int($input["ratePeriod"]);

try {
    if ($input && $validRatePeriod) {
        $getRates = $db->prepare("SELECT t0.id AS `itemId`, t0.name, t0.unit, ".($validLocation ? "(SELECT SUM(quantity) FROM transactions WHERE locationId = :locationId AND deleted = 0 AND itemId = t0.id)" : "t0.currentStock")." as currentStock, t0.warningLevel, t1.days, t1.lastTransaction, t2.withdrawn, t3.restocked, CAST(ABS(t2.withdrawn/:ratePeriod1) AS DOUBLE) AS `withdrawRate`, CAST(ABS(t3.restocked/:ratePeriod2) AS DOUBLE) AS `restockRate`, CAST(ABS(t2.withdrawn/t3.restocked) AS DOUBLE) AS `burnRate`, CAST(ABS(t3.restocked/t2.withdrawn) AS DOUBLE) AS `douseRate`, currentStock/(SELECT withdrawRate) as daysUntilOutOfStock, (IF(currentStock < warningLevel, warningLevel, currentStock) - IFNULL((SELECT withdrawRate),0))/(SELECT withdrawRate) as daysUntilBelowWarningLevel FROM `items` t0
    
    LEFT JOIN (SELECT *, `itemId` AS id1, DATEDIFF(NOW(), (MIN(timestamp))) AS `days`, MAX(timestamp) AS `lastTransaction` FROM `transactions` WHERE `timestamp` >= (NOW() - INTERVAL :ratePeriod3 DAY) " . ($validLocation ? "AND locationId = :locationId1" : "") . " GROUP BY `itemId`) t1 ON t0.id = t1.id1
    
    LEFT JOIN (SELECT `itemId` AS id2, CAST(SUM(quantity) AS INTEGER) AS `withdrawn` FROM `transactions` WHERE `quantity` < 0 AND `timestamp` >= (NOW() - INTERVAL :ratePeriod4 DAY) " . ($validLocation ? "AND locationId = :locationId2" : "") . " GROUP BY `itemId`) t2 ON t1.itemId = t2.id2
    
    LEFT JOIN (SELECT `itemId` AS id3, CAST(SUM(quantity) AS INTEGER) AS `restocked` FROM `transactions` WHERE `quantity` > 0 AND `timestamp` >= (NOW() - INTERVAL :ratePeriod5 DAY) " . ($validLocation ? "AND locationId = :locationId3" : "") . " GROUP BY `itemId`) t3 ON t1.itemId = t3.id3
    
    WHERE t0.deleted = 0 AND t0.organisationId = :organisationId");

        $getRates->bindValue(":ratePeriod1", $input["ratePeriod"]);
        $getRates->bindValue(":ratePeriod2", $input["ratePeriod"]);
        $getRates->bindValue(":ratePeriod3", $input["ratePeriod"]);
        $getRates->bindValue(":ratePeriod4", $input["ratePeriod"]);
        $getRates->bindValue(":ratePeriod5", $input["ratePeriod"]);
    } else {
        $getRates = $db->prepare("SELECT t0.id AS `itemId`, t0.name, t0.unit, ".($validLocation ? "(SELECT SUM(quantity) FROM transactions WHERE locationId = :locationId AND deleted = 0 AND itemId = t0.id) as currentStock" : "t0.currentStock").", t0.warningLevel, t1.days, t1.lastTransaction, t2.withdrawn, t3.restocked, CAST(ABS(t2.withdrawn/t1.days) AS DOUBLE) AS `withdrawRate`, CAST(ABS(t3.restocked/t1.days) AS DOUBLE) AS `restockRate`, CAST(ABS(t2.withdrawn/t3.restocked) AS DOUBLE) AS `burnRate`, CAST(ABS(t3.restocked/t2.withdrawn) AS DOUBLE) AS `douseRate`, currentStock/(SELECT withdrawRate) as daysUntilOutOfStock, (IF(currentStock < warningLevel, warningLevel, currentStock) - IFNULL((SELECT withdrawRate),0))/(SELECT withdrawRate) as daysUntilBelowWarningLevel FROM `items` t0
        
    LEFT JOIN (SELECT *, `itemId` AS id1, DATEDIFF(NOW(), MIN(timestamp)) AS `days`, MAX(timestamp) AS `lastTransaction` FROM `transactions` " . ($validLocation ? "WHERE locationId = :locationId1" : "") . " GROUP BY `itemId`) t1 ON t0.id = t1.id1
        
    LEFT JOIN (SELECT `itemId` AS id2, CAST(SUM(quantity) AS INTEGER) AS `withdrawn` FROM `transactions` WHERE `quantity` < 0 " . ($validLocation ? "AND locationId = :locationId2" : "") . " GROUP BY `itemId`) t2 ON t1.itemId = t2.id2
        
    LEFT JOIN (SELECT `itemId` AS id3, CAST(SUM(quantity) AS INTEGER) AS `restocked` FROM `transactions` WHERE `quantity` > 0 " . ($validLocation ? "AND locationId = :locationId3" : "") . " GROUP BY `itemId`) t3 ON t1.itemId = t3.id3
        
    WHERE t0.deleted = 0 AND t0.organisationId = :organisationId");
    }
    if ($validLocation) {
        $getRates->bindValue(':locationId', $input["locationId"]);
        $getRates->bindValue(':locationId1', $input["locationId"]);
        $getRates->bindValue(':locationId2', $input["locationId"]);
        $getRates->bindValue(':locationId3', $input["locationId"]);
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
    " . ($validLocation ? "AND a.locationId = :locationId" : "") . "
    GROUP BY b.date
    ORDER BY b.date ASC");
    if ($validLocation) {
        $getChartData->bindValue(':locationId', $input["locationId"]);
    }
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
    " . ($validLocation ? "AND a.locationId = :locationId" : "") . "
    GROUP BY a.itemID, b.date
    ORDER BY b.date ASC");
    if ($validLocation) {
        $getChartItemData->bindValue(':locationId', $input["locationId"]);
    }
    $getChartItemData->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $getChartItemData->execute();
    $output["chartItemData"] = $getChartItemData->fetchAll(PDO::FETCH_ASSOC);

    if ($validLocation || $validRatePeriod) {
        $output["feedback"] = "Now showing data for ";
        $output["feedback"] .= $validLocation ? ($input["locationName"] . " ") : "all locations ";
        $output["feedback"] .= $validRatePeriod ? ("in the last " . $input["ratePeriod"] . " day" . (intval($input["ratePeriod"]) === 1 ? "" : "s")) : "";
    } else {
        $output["feedback"] = "Now showing data for all locations over all time";
    }
    $output["success"] = true;

} catch (PDOException $e) {
    $output["feedback"] = $e->getMessage();
}

echo json_encode($output);
