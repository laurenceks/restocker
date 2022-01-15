<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("items", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["title"] = "Missing item";
    $output["errorType"] = "itemMissing";
} else if (checkFunctionExists("items", "name", array(array("key" => "name", "value" => $input["name"])), false, true, $input["id"])) {
    $output["feedback"] = "An item with that name already exists, please change the item name and try again";
    $output["errorMessage"] = "An item with that name already exists";
    $output["title"] = "Item already exists";
    $output["errorType"] = "itemExists";
} else {
    try {
        $editItem = $db->prepare("UPDATE items SET name = :name, unit = :unit,warningLevel = :warningLevel, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $editItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editItem->bindParam(":name", $input["name"]);
        $editItem->bindParam(":unit", $input["unit"]);
        $editItem->bindParam(":warningLevel", $input["warningLevel"]);
        $editItem->bindParam(":id", $input["id"]);
        $editItem->bindValue(":uid", $_SESSION["user"]->userId);
        $editItem->execute();
        $output["success"] = true;
        $output["title"] = "Item updated";
        $output["feedback"] = $input["name"] . " was updated successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);