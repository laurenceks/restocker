<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("listRows" => array(), "lists" => array()));

$getAllLists = $db->prepare("
        SELECT lists.id,
       lists.name,
       lists.organisationid,
       items.id   AS itemId,
       items.name AS itemName,
       items.unit,
               list_items.deleted,
       list_items.quantity,
               list_items.id as listItemsId   
FROM   lists
       LEFT JOIN list_items
              ON list_items.listid = lists.id
       LEFT JOIN items
              ON items.id = list_items.itemid
WHERE  lists.organisationid = :organisationId
       AND items.deleted = 0 
AND lists.deleted = 0
AND list_items.deleted = 0
        ");
$getAllLists->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllLists->execute();
$allLists = $getAllLists->fetchAll(PDO::FETCH_ASSOC);
$output["listItems"] = $allLists;

$previousRow = array("locationId" => null, "id" => null);

foreach ($allLists as $row) {
    if ($previousRow["id"] === $row["id"]) {
        $output["lists"][count($output["lists"]) - 1]["items"][] = array_slice($row, 3);
    } else {
        $output["lists"][] = array("id" => $row["id"], "name" => $row["name"], "items" => array(array_slice($row, 3)));
    }
    $previousRow = $row;
}

$output["success"] = true;
$output["title"] = "Lists updated";
$output["feedback"] = "Lists data has been refreshed";

echo json_encode($output);
