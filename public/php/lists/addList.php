<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "addFunctionListItem.php";
require "../common/checkFunctionExists.php";

require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (checkFunctionExists("lists", "id", array(array("key" => "name", "value" => $input["name"])))) {
    //a list with that name already exists
    $output["feedback"] = "A list with that name already exists, please change the list name and try again";
    $output["title"] = "List exists";
    $output["errorMessage"] = "A list with that name already exists";
    $output["errorType"] = "listExists";
} else if (!checkFunctionExists("items", "id", array(array("key" => "id", "value" => $input["itemId"])))) {
    //that item doesn't exist
    $output["feedback"] = $input["itemName"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing item";
    $output["errorMessage"] = input["itemName"] . " could not be found";
    $output["errorType"] = "missingItem";
} else {
    try {
        $addList = $db->prepare("INSERT INTO lists (organisationId, name, createdBy, editedBy) VALUES (:organisationId,:name, :uid1, :uid2)");
        $addList->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addList->bindParam(":name", $input["name"]);
        $addList->bindValue(":uid1", $_SESSION["user"]->userId);
        $addList->bindValue(":uid2", $_SESSION["user"]->userId);
        $addList->execute();
        $addListItem = addFunctionListItem($db->lastInsertId(), $input["itemId"], $input["quantity"], $_SESSION["user"]->organisationId, $_SESSION["user"]->userId);
        if ($addListItem["success"]) {
            $output["success"] = true;
            $output["title"] = "List added";
            $output["feedback"] = $input["name"] . " was added successfully";
        } else {
            $output["feedback"] = $addListItem;
        }
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => $e->getMessage(), "errorMessage" => $e->getMessage(), "errorType" => "queryError"));

    }
}
echo json_encode($output);