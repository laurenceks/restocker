<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "addFunctionListItem.php";
require "../common/checkFunctionExists.php";

require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("lists", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing list";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "listMissing";
} else if (checkFunctionExists("lists", "name", array(array("key" => "name", "value" => $input["name"])), false, true, $input["id"])) {
    $output["title"] = "List already exists";
    $output["feedback"] = "A list with that name already exists, please change the list name and try again";
    $output["errorMessage"] = "List already exists";
    $output["errorType"] = "listExists";
} else {
    try {
        //TODO test checks
        $editList = $db->prepare("UPDATE lists SET name = :name, editedBy = :uid1 WHERE id = :id");
        $editList->bindParam(":name", $input["name"]);
        $editList->bindValue(":id", $input["id"]);
        $editList->bindValue(":uid1", $_SESSION["user"]->userId);
        $editList->execute();

        foreach ($input["items"] as $item) {
            if (!checkFunctionExists("items", "id", array(array("key" => "id", "value" => $item["itemId"])))) {
                //item no longer exists
                $output["feedback"] = $output["errorType"] === "itemMissing" ? "\t• " . $item["itemName"] . "\n" : "An item you have selected is missing - possibly due to deletion - please try again:\n\n\t• " . $item["itemName"] . "\n";
            } else {
                try {
                    if (!$item["deleted"] || isset($item["listItemsId"])) {
                        if (isset($item["listItemsId"]) && checkFunctionExists("list_items", "id", array(array("key" => "id", "value" => $item["listItemsId"])), true)) {
                            //list item exists - update (including setting deletion)
                            $editListItem = $db->prepare("UPDATE list_items SET itemId = :itemId, quantity = :quantity, editedBy = :uid1, deleted = :deleted WHERE id = :listItemsId");
                            $editListItem->bindParam(":listItemsId", $item["listItemsId"]);
                            $editListItem->bindParam(":deleted", $item["deleted"]);
                        } else {
                            //list item doesn't exist - insert
                            $editListItem = $db->prepare("INSERT INTO list_items (listId, itemId, organisationId, quantity, createdBy, editedBy) VALUES (:listId, :itemId, :organisationId, :quantity, :uid1, :uid2)");
                            $editListItem->bindValue(":listId", $input["id"]);
                            $editListItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
                            $editListItem->bindValue(":uid2", $_SESSION["user"]->userId);
                        }
                        $editListItem->bindParam(":itemId", $item["itemId"]);
                        $editListItem->bindParam(":quantity", $item["quantity"]);
                        $editListItem->bindValue(":uid1", $_SESSION["user"]->userId);
                        $editListItem->execute();
                    }
                } catch (PDOException $e) {
                    $output["errorTypes"][] = "queryError";
                    $output["feedback"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
                    $output["errorMessage"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
                    $output["errorType"] = "queryError";
                }
            }
        }
        $output["success"] = true;
        $output["title"] = "List updated";
        $output["feedback"] = $input["name"] . " was updated successfully";
    } catch (PDOException $e) {
        $output["errorTypes"][] = "queryError";
        $output["feedback"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
        $output["errorMessage"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
        $output["errorType"] = "queryError";
    }
}
echo json_encode($output);