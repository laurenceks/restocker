<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";
require "../common/fetchFunctions/fetchFunctionLocations.php";

$output = array("items" => array(), "locations" => array(), "itemsByLocationId" => array());
$getAllItems = $db->prepare('SELECT items.id,
                                   items.name,
                                   items.unit,
                                   "all" AS locationId,
                                   items.currentStock,
                                   items.warninglevel
                            FROM   items
                                   LEFT JOIN transactions
                                          ON items.id = transactions.itemid
                            GROUP  BY transactions.itemid
                            UNION
                            SELECT items.id,
                                   items.name,
                                   items.unit,
                                   transactions.locationid,
                                   CAST(SUM(quantity) AS INTEGER) AS currentStock,
                                   items.warninglevel
                            FROM   `items`
                                   LEFT JOIN transactions
                                          ON items.id = transactions.itemid
                            WHERE  items.organisationid = :organisationId1
                                   AND transactions.organisationid = :organisationId2
                            GROUP  BY items.id,
                                      transactions.locationid
                            ORDER  BY locationid,
                                      id; ');
$getAllItems->bindValue(':organisationId1', $_SESSION["user"]->organisationId);
$getAllItems->bindValue(':organisationId2', $_SESSION["user"]->organisationId);
$getAllItems->execute();
$items = $getAllItems->fetchAll(PDO::FETCH_ASSOC);

foreach ($items as $row) {
    $output["itemsByLocationId"][$row["locationId"]][] = $row;
    $output["itemsByLocationThenItemId"][$row["locationId"]][$row["id"]] = $row;
    if ($row["locationId"] === "all") {
        $output["items"][] = $row;
    }
};

$output["locations"] = fetchFunctionLocations($_SESSION["user"]->organisationId);

echo json_encode($output);
