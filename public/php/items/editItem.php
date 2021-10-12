<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $editItem = $db->prepare("UPDATE items SET name = :name, unit = :unit, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
    $editItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $editItem->bindParam(":name", $input["name"]);
    $editItem->bindParam(":unit", $input["unit"]);
    $editItem->bindParam(":id", $input["id"]);
    $editItem->bindValue(":uid", $_SESSION["user"]->userId);
    $editItem->execute();
    $output["success"] = true;
    $output["feedback"] = "Item updated";
} catch
(PDOException $e) {
    echo $output["feedback"] = $e->getMessage();
}

echo json_encode($output);