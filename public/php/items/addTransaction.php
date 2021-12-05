<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require_once "../common/updateCurrentStockLevel.php";
require "../common/fetchFunctions/fetchFunctionItems.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "title" => null, "outOfStockItems" => array(), "missingItems" => array(), "missingLocations" => array(), "errorTypes" => array());

if ($input["transactionFormType"] !== "restock") {
    $currentItemsAtLocationByItemId = array();
    foreach (fetchFunctionItems($_SESSION["user"]->organisationId, $input["locationId"]) as $row) {
        $currentItemsAtLocationByItemId[$row["locationId"]][$row["id"]] = $row;
    }
    $output["current"] = $currentItemsAtLocationByItemId;

    //make sure each item has sufficient stock before proceeding
    //TODO fetch locations list and make sure location still exists
    foreach ($input["transactionArray"] as $transaction) {
        if (!$transaction["itemId"]) {
            //invalid item Id
            $output["feedback"] = "Invalid itemId passed";
            $output["errorTypes"][] = "invalidItemId";
            earlyExit($output);
        } else if (!isset($currentItemsAtLocationByItemId["all"][$transaction["itemId"]])) {
            //item doesn't exist anymore
            $output["missingItems"][] = array("id" => $transaction["itemId"], "name" => $transaction["itemName"], "requested" => abs($transaction["quantity"]));
        } else if (!isset($currentItemsAtLocationByItemId[$input["locationId"]]) || !isset($currentItemsAtLocationByItemId[$input["locationId"]][$transaction["itemId"]]) || abs($transaction["quantity"]) > $currentItemsAtLocationByItemId[$input["locationId"]][$transaction["itemId"]]["currentStock"]) {
            //an item can't be withdrawn because it is out of stock
            $output["outOfStockItems"][] = array("id" => $transaction["itemId"], "name" => $transaction["itemName"], "requested" => abs($transaction["quantity"]), "current" => $currentItemsAtLocationByItemId[$input["locationId"]][$transaction["itemId"]]["currentStock"]);
        }
    }
    if (count($output["missingItems"]) > 0) {
        $output["feedback"] .= (count($output["outOfStockItems"]) === 1 ? "One" : "Some") . " of the items requested are missing - possibly due to deletion - please review your transaction and try again (stock levels have been refreshed)";
        $output["errorTypes"][] = "missingItems";
        earlyExit($output);
    } else if (count($output["outOfStockItems"]) > 0) {
        $output["feedback"] .= "There is insufficient stock for " . (count($output["outOfStockItems"]) === 1 ? "One" : "some") . " of the items requested at the given location, please review your transaction and try again (stock levels have been refreshed)";
        $output["errorTypes"][] = "outOfStock";
        earlyExit($output);
    }
}

$transactionQueries = array();

foreach ($input["transactionArray"] as $transaction) {
    $addTransaction = $db->prepare("INSERT INTO transactions (itemId, type, quantity, userId, organisationId, locationId, isTransfer) VALUES (:itemId, :type, :quantity, :userId, :organisationId, :locationId, :isTransfer)");
    $addTransaction->bindParam(":itemId", $transaction["itemId"]);
    $transactionFormType = $input["transactionFormType"] || $transaction["quantity"] < 0 ? "withdraw" : "restock";
    $addTransaction->bindParam(":type", $transactionFormType);
    $addTransaction->bindParam(":locationId", $transaction["locationId"]);
    $addTransaction->bindParam(":isTransfer", $transaction["isTransfer"]);
    $addTransaction->bindParam(":quantity", $transaction["quantity"]);
    $addTransaction->bindValue(":userId", $_SESSION["user"]->userId);
    $addTransaction->bindValue(":organisationId", $_SESSION["user"]->organisationId);
    $transactionQueries[] = $addTransaction;
}

foreach ($transactionQueries as $query) {
    try {
        $query->execute();
        updateCurrentStockLevel();
    } catch (PDOException $e) {
        echo $output["feedback"] = $e->getMessage();
    }
}

$output["success"] = true;
$output["title"] = "Transactions complete";
//TODO update feedback message with each item
$output["feedback"] = "Saved";

echo json_encode($output);

function earlyExit($output)
{
    echo json_encode($output);
    exit();
}