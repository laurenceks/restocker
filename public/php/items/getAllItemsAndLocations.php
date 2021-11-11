<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";
require "../common/fetchFunctions/fetchFunctionLocations.php";
require "../common/fetchFunctions/fetchFunctionItems.php";

$output = array("items" => array(), "locations" => array(), "itemsByLocationId" => array());
$items = fetchFunctionItems($_SESSION["user"]->organisationId);

foreach ($items as $row) {
    $output["itemsByLocationId"][$row["locationId"]][] = $row;
    $output["itemsByLocationThenItemId"][$row["locationId"]][$row["id"]] = $row;
    if ($row["locationId"] === "all") {
        $output["items"][] = $row;
    }
};

$output["locations"] = fetchFunctionLocations($_SESSION["user"]->organisationId);

echo json_encode($output);
