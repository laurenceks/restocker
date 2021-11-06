<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require_once "../common/updateCurrentStockLevel.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $addTransaction = $db->prepare("INSERT INTO transactions (itemId, type, quantity, userId, organisationId, locationId) VALUES (:itemId, :type, :quantity, :userId, :organisationId, :locationId)");
    $addTransaction->bindParam(":itemId", $input["itemId"]);
    $transactionType = $input["quantity"] < 0 ? "withdraw" : "restock";
    $addTransaction->bindParam(":type", $transactionType);
    $addTransaction->bindParam(":locationId", $input["locationId"]);
    $addTransaction->bindParam(":quantity", $input["quantity"]);
    $addTransaction->bindValue(":userId", $_SESSION["user"]->userId);
    $addTransaction->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $addTransaction->execute();
    $output["success"] = true;
    $output["feedback"] = "Transaction added (" . $transactionType . ")";

    $output["stockLevelUpdate"] = updateCurrentStockLevel();

} catch
(PDOException $e) {
    echo $output["feedback"] = $e->getMessage();
}

echo json_encode($output);