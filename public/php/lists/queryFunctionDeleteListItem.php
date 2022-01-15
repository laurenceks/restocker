<?php
function addFunctionListItem($id, $organisationId, $userId) {
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
    try {
        $deleteListItems = $db->prepare("UPDATE list_items SET deleted = 1, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deleteListItems->bindValue(":organisationId", $organisationId);
        $deleteListItems->bindParam(":id", $id);
        $deleteListItems->bindValue(":uid", $userId);
        $deleteListItems->execute();
        return array("success" => true, "feedback" => "Item deleted from list");
    } catch (PDOException $e) {
        return array("success" => false, "feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => array("queryError"), "errorTypes" => array("queryError"));
    }
}