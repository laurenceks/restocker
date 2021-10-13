<?php

function updateCurrentStockLevel()
{
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
    $output = array("success" => false, "feedback" => "An unknown error occurred");
    try {
        $updateCurrentStock = $db->prepare("UPDATE items set items.currentStock = (SELECT SUM(transactions.quantity) FROM transactions WHERE transactions.itemId=items.id AND transactions.organisationId = :organisationId1) WHERE items.organisationId = :organisationId2");
        $updateCurrentStock->bindValue(":organisationId1", $_SESSION["user"]->organisationId);
        $updateCurrentStock->bindValue(":organisationId2", $_SESSION["user"]->organisationId);
        $updateCurrentStock->execute();
        $output["success"] = true;
        $output["feedback"] = "Stock levels updated";
    } catch
    (PDOException $e) {
        return $output["feedback"] = $e->getMessage();
    }
    return json_encode($output);
}

