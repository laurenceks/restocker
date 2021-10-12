<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $addItem = $db->prepare("INSERT INTO items (organisationId, name, unit, createdBy, editedBy) VALUES (:organisationId,:name, :unit, :uid1, :uid2)");
    $addItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $addItem->bindParam(":name", $input["inputAddItemName"]);
    $addItem->bindParam(":unit", $input["inputAddItemUnit"]);
    $addItem->bindValue(":uid1", $_SESSION["user"]->userId);
    $addItem->bindValue(":uid2", $_SESSION["user"]->userId);
    $addItem->execute();
    $output["success"] = true;
    $output["feedback"] = "Item added";
} catch
(PDOException $e) {
    echo $output["feedback"] = $e->getMessage();
}

echo json_encode($output);