<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";
require "../common/fetchFunctions/fetchFunctionLocations.php";
require "../common/fetchFunctions/fetchFunctionItems.php";
require "../common/fetchFunctions/fetchFunctionLists.php";

$output = array("items" => array(), "locations" => array(), "itemsByLocationId" => array());
$items = fetchFunctionItems($_SESSION["user"]->organisationId);

foreach ($items as $row) {
    $output["itemsByLocationId"][$row["locationId"]][] = $row;
    $output["itemsByLocationThenItemId"][$row["locationId"]][$row["id"]] = $row;
    if ($row["locationId"] === "all") {
        $output["items"][] = $row;
    }
};

$lists = fetchFunctionLists($_SESSION["user"]->organisationId);

$previousRow = array("locationId" => null, "id" => null);
foreach ($lists as $row) {
    if ($previousRow["locationId"] === $row["locationId"] && $previousRow["id"] === $row["id"]) {
        $rowItem = array_slice($row, 3);
        $listsTypes = array(
            &$output["lists"][count($output["lists"]) - 1],
            &$output["listsByLocationId"][$row["locationId"]][count($output["listsByLocationId"][$row["locationId"]]) - 1],
            &$output["listsByLocationThenListId"][$row["locationId"]][$row["id"]]);
        foreach ($listsTypes as &$prev) {
            $prev["items"][] = $rowItem;
            $prev["currentStock"] = min($prev["currentStock"], floor($row["currentStock"] / $row["quantity"]));
        }
    } else {
        $rowStart = array("id" => $row["id"], "name" => $row["listName"], "locationId" => $row["locationId"], "currentStock" => floor($row["currentStock"] / ($row["quantity"] || 1)), "items" => array(array_slice($row, 3)));
        $output["lists"][] = $rowStart;
        $output["listsByLocationId"][$row["locationId"]][] = $rowStart;
        $output["listsByLocationThenListId"][$row["locationId"]][$row["id"]] = $rowStart;
    }
    $previousRow = $row;
};

$output["locations"] = fetchFunctionLocations($_SESSION["user"]->organisationId);

echo json_encode($output);
