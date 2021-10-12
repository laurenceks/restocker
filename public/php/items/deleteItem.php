<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $addItem = $db->prepare("UPDATE items SET deleted = 1 WHERE id = :id AND organisationId = :organisationId");
    $addItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $addItem->bindParam(":id", $input["id"]);
    $addItem->execute();
    $output["success"] = true;
    $output["feedback"] = "Item deleted";
} catch
(PDOException $e) {
    echo $output["feedback"] = $e->getMessage();
}

echo json_encode($output);