<?php
function addFunctionListItem($listId, $itemId, $quantity, $organisationId, $userId)
{
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
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
        return array("success" => false,
            "feedback" => $e->getMessage(),
            "errorMessage" => $e->getMessage(),
            "errorType" => array($e->getCode()),
            "errorTypes" => array("queryError"));
    }
}