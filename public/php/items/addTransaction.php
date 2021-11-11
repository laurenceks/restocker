<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require_once "../common/updateCurrentStockLevel.php";
require "../common/fetchFunctions/fetchFunctionItems.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "outOfStockItems" => array(), "errorType" => null);

$currentItemsAtLocation = array_filter(fetchFunctionItems($_SESSION["user"]->organisationId, $input["locationId"]), function ($row) use ($input, $output) {
    return intval($row["locationId"]) == $input["locationId"];
});


if ($input["transactionType"] !== "restock") {
    $currentItemsAtLocationByItemId = array();
    foreach ($currentItemsAtLocation as $item) {
        $currentItemsAtLocationByItemId[$item["id"]] = $item;
    }
    $output["current"] = $currentItemsAtLocationByItemId;

    //make sure each item has sufficient stock before proceeding
    foreach ($input["transactionArray"] as $transaction) {
        if (!$transaction["itemId"] || !$currentItemsAtLocationByItemId[$transaction["itemId"]] || abs($transaction["quantity"]) > $currentItemsAtLocationByItemId[$transaction["itemId"]]["currentStock"]) {
            //an item can't be withdrawn
            $output["outOfStockItems"][] = array("id" => $transaction["itemId"], "requested" => abs($transaction["quantity"]), "current" => $currentItemsAtLocationByItemId[$transaction["itemId"]]["currentStock"]);
        }
    }
    if (count($output["outOfStockItems"]) > 0) {
        $output["feedback"] = "There is insufficient stock for " . (count($output["outOfStockItems"]) === 1 ? "one" : "some") . " of the items requested, please try again";
        $output["errorType"] = "outOfStock";
        echo json_encode($output);
        exit();
    }
}

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
    updateCurrentStockLevel();

} catch
(PDOException $e) {
    echo $output["feedback"] = $e->getMessage();
}

echo json_encode($output);