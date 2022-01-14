<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

try {
    $deleteList = $db->prepare("UPDATE lists SET deleted = 0, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
    $deleteList->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $deleteList->bindValue(":id", $input["id"]);
    $deleteList->bindValue(":uid", $_SESSION["user"]->userId);
    $deleteList->execute();

    $deleteListItems = $db->prepare("UPDATE list_items SET deleted = 0, editedBy = :uid WHERE listId = :id AND organisationId = :organisationId");
    $deleteListItems->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $deleteListItems->bindValue(":id", $input["id"]);
    $deleteListItems->bindValue(":uid", $_SESSION["user"]->userId);
    $deleteListItems->execute();

    $output["success"] = true;
    $output["feedback"] = $input["name"] . " was restored successfully";
} catch (PDOException $e) {
    echo $output["feedback"] = $e->getMessage();
    $output["errorMessage"] = $e->getMessage();
    $output["errorType"] = "queryError";
}

echo json_encode($output);