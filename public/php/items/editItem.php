<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "title" => null);

if (!checkFunctionExists("items", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["errorType"] = "itemMissing";
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
} else if (checkFunctionExists("items", "name", array(array("key" => "name", "value" => $input["name"])), false, true)) {
    $output["errorType"] = "itemExists";
    $output["feedback"] = "An item with that name already exists, please change the item name and try again";
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
    } catch
    (PDOException $e) {
        echo $output["feedback"] = $e->getMessage();
    }
}

echo json_encode($output);