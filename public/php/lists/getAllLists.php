<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";

$output = array("listRows" => array(), "lists" => array());
$getAllLists = $db->prepare("
        SELECT lists.id,
       lists.name,
       lists.organisationid,
       items.id   AS itemId,
       items.NAME AS itemName,
       items.unit,
       listitems.quantity,
               listitems.id as listItemsId   
FROM   lists
       LEFT JOIN listitems
              ON listitems.listid = lists.id
       LEFT JOIN items
              ON items.id = listitems.itemid
WHERE  lists.organisationid = :organisationId
       AND items.deleted = 0 
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
};


echo json_encode($output);
