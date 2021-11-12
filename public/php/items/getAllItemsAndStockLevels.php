<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";

$output = array("items" => array());
$getAllItems = $db->prepare('SELECT items.id,
                                   items.name,
                                   items.unit,
                                   "all" AS locationId,
                                   items.currentStock,
                                   items.warningLevel
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
                                   items.warningLevel
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
    if ($row["locationId"] === "all") {
        $output["items"][] = $row;
    }
};

echo json_encode($output);
