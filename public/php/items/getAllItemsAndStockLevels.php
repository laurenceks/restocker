<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";

$output = array("items" => array(), "lists"=>array());
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
                                   CAST(SUM(quantity) AS SIGNED) AS currentStock,
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

$getAllLists = $db->prepare("SELECT 
'all' as locationId,
lists.id,
lists.name AS listName,
list_items.itemId,
list_items.quantity,
items.name,
items.currentStock AS currentStock,
items.warningLevel
FROM lists
LEFT JOIN list_items ON lists.id = list_items.listId
LEFT JOIN items ON items.id = list_items.itemId
LEFT JOIN transactions ON transactions.itemId = list_items.itemId
WHERE lists.organisationId = :organisationId1 AND lists.deleted = 0 AND transactions.organisationId = :organisationId2
GROUP BY lists.id, items.id

UNION

SELECT 
transactions.locationId as locationId,
lists.id,
lists.name AS listName,
list_items.itemId,
list_items.quantity,
items.name,
SUM(transactions.quantity) AS currentStock,
items.warningLevel
FROM lists
LEFT JOIN list_items ON lists.id = list_items.listId
LEFT JOIN items ON items.id = list_items.itemId
LEFT JOIN transactions ON transactions.itemId = list_items.itemId
WHERE lists.organisationId = :organisationId3 AND lists.deleted = 0 AND transactions.organisationId = :organisationId4
GROUP BY transactions.locationId, lists.id, items.id;");

$getAllLists->bindValue(':organisationId1', $_SESSION["user"]->organisationId);
$getAllLists->bindValue(':organisationId2', $_SESSION["user"]->organisationId);
$getAllLists->bindValue(':organisationId3', $_SESSION["user"]->organisationId);
$getAllLists->bindValue(':organisationId4', $_SESSION["user"]->organisationId);
$getAllLists->execute();
$lists = $getAllLists->fetchAll(PDO::FETCH_ASSOC);

$output["listsRaw"] = $lists;

foreach ($lists as $row) {
    $output["listsByLocationId"][$row["locationId"]][] = $row;
    if ($row["locationId"] === "all") {
        $output["lists"][] = $row;
    }
};
echo json_encode($output);
