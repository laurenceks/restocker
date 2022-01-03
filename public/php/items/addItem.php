<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (checkFunctionExists("items", "id", array(array("key" => "name", "value" => $input["inputAddItemName"])))) {
    $output["errorType"] = "itemExists";
    $output["title"] = "Item already exists";
    $output["feedback"] = "An item with that name already exists, please change the item name and try again";
} else {
    try {
        $addItem = $db->prepare("INSERT INTO items (organisationId, name, unit, warningLevel, createdBy, editedBy) VALUES (:organisationId,:name, :unit, :warningLevel, :uid1, :uid2)");
        $addItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addItem->bindParam(":name", $input["inputAddItemName"]);
        $addItem->bindParam(":unit", $input["inputAddItemUnit"]);
        $addItem->bindParam(":warningLevel", $input["inputAddItemWarningLevel"]);
        $addItem->bindValue(":uid1", $_SESSION["user"]->userId);
        $addItem->bindValue(":uid2", $_SESSION["user"]->userId);
        $addItem->execute();
        $output["success"] = true;
        $output["title"] = "Item added";
        $output["feedback"] = $input["inputAddItemName"] . " was added successfully";
    } catch (PDOException $e) {
        //TODO replace server error message with generic message for security
        $output = array_merge($output, array("feedback" => $e->getMessage(), "errorMessage" => $e->getMessage(), "errorType" => "queryError"));
    }
}

echo json_encode($output);