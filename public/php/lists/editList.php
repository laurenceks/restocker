<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "addFunctionListItem.php";
require "../common/checkFunctionExists.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "errorType" => null);

if (!checkFunctionExists("lists", "id", array(array("key" => "id", "value" => $input["id"])))) {
    //list doesn't exit
    $output["errorType"] = "listMissing";
    $output["feedback"] = "This list you are trying to edit is missing - possibly due to deletion - please try again";
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
                $output["errorType"] = json_encode(array_merge($input, $item));
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
                    echo $output["feedback"] = $e->getMessage();
                }
            }
        }
    } catch (PDOException $e) {
        echo $output["feedback"] = $e->getMessage();
    }
}
echo json_encode($output);