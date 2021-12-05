<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "title" => null);

if (!checkFunctionExists("items", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["errorType"] = "itemMissing";
    $output["title"] = "Missing item";
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
} else {
    try {
        $deleteItem = $db->prepare("UPDATE items SET deleted = 1, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deleteItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $deleteItem->bindParam(":id", $input["id"]);
        $deleteItem->bindValue(":uid", $_SESSION["user"]->userId);
        $deleteItem->execute();
        $output["success"] = true;
        $output["title"] = "Item deleted";
        $output["feedback"] = $input["name"] . " was deleted successfully";
    } catch
    (PDOException $e) {
        echo $output["feedback"] = $e->getMessage();
    }
}

echo json_encode($output);