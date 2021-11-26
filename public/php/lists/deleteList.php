<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $deleteList = $db->prepare("UPDATE lists SET deleted = 1, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
    $deleteList->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $deleteList->bindValue(":id", $input["id"]);
    $deleteList->bindValue(":uid", $_SESSION["user"]->userId);
    $deleteList->execute();

    $deleteListItems = $db->prepare("UPDATE list_items SET deleted = 1, editedBy = :uid WHERE listId = :id AND organisationId = :organisationId");
    $deleteListItems->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $deleteListItems->bindValue(":id", $input["id"]);
    $deleteListItems->bindValue(":uid", $_SESSION["user"]->userId);
    $deleteListItems->execute();

    $output["success"] = true;
    $output["feedback"] = "List deleted";
} catch
(PDOException $e) {
    echo $output["feedback"] = $e->getMessage();
}

echo json_encode($output);