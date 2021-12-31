<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("items", "id", array(array("key" => "id", "value" => $input["id"])), true)) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to permanent deletion - please try again";
    $output["title"] = "Missing item";
    $output["errorType"] = "itemMissing";
} else {
    try {
        $deleteItem = $db->prepare("UPDATE items SET deleted = 0, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deleteItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $deleteItem->bindParam(":id", $input["id"]);
        $deleteItem->bindValue(":uid", $_SESSION["user"]->userId);
        $deleteItem->execute();
        $output["success"] = true;
        $output["title"] = "Item restored";
        $output["feedback"] = $input["name"] . " was restored successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => $e->getMessage(), "errorMessage" => $e->getMessage(), "errorType" => "queryError"));
    }
}

echo json_encode($output);