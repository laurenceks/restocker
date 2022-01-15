<?php
function addFunctionListItem($listId, $itemId, $itemName, $quantity, $organisationId, $userId) {
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
    if (!checkFunctionExists("items", "id", array(array("key" => "id", "value" => $itemId)))) {
        //item no longer exists
        return array("success" => false, "feedback" => $itemName . " could not be found - possibly due to deletion - please try again", "errorType" => "missingItem", "errorTypes" => array("missingItem"));
    } else {
        try {
            $addList = $db->prepare("INSERT INTO list_items (listId, itemId, quantity, organisationId, createdBy, editedBy) VALUES (:listId, :itemId, :quantity, :organisationId, :uid1, :uid2)");
            $addList->bindValue(":listId", $listId);
            $addList->bindValue(":itemId", $itemId);
            $addList->bindValue(":quantity", $quantity);
            $addList->bindValue(":organisationId", $organisationId);
            $addList->bindValue(":uid1", $userId);
            $addList->bindValue(":uid2", $userId);
            $addList->execute();
            return array("success" => true, "feedback" => "Item added to list");
        } catch (PDOException $e) {
            return array("success" => false, "feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => array("queryError"), "errorTypes" => array("queryError"));
        }
    }
}