<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require_once "../common/updateCurrentStockLevel.php";
require "../common/fetchFunctions/fetchFunctionItems.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array_merge($feedbackTemplate, array("outOfStockItems" => array(), "missingItems" => array(), "missingLocations" => array()));

if (!checkFunctionExists("locations", "id", array(array("key" => "id", "value" => $input["locationId"])))) {
    //location not found
    $output["feedback"] = "The location your are attempting to " . ($input["transactionFormType"] === "restock" ? "restock" : "withdraw from") . " could not be found - possibly due to deletion - please try again";
    $output["errorMessage"] = "Location not found";
    $output["errorType"] = "missingLocation";
    $output["errorTypes"][] = "missingLocation";
    earlyExit($output);
} else if ($input["transactionFormType"] === "transfer" && !checkFunctionExists("locations", "id", array(array("key" => "id", "value" => $input["destinationId"])))) {
    $output["feedback"] = "The location your are attempting to send stock to could not be found - possibly due to deletion - please try again";
    $output["errorMessage"] = "Destination not found";
    $output["errorTypes"][] = "missingDestination";
    $output["errorType"] = "missingDestination";
    earlyExit($output);
} else if ($input["transactionFormType"] !== "restock") {
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
            $output["errorMessage"] = "Invalid itemId passed";
            $output["errorTypes"][] = "invalidItemId";
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
        $output["feedback"] = (count($output["outOfStockItems"]) === 1 ? "one" : "Some") . " of the items requested are missing - possibly due to deletion - please review your transaction and try again (stock levels have been refreshed):\n\n";
        foreach ($output["missingItems"] as $missingItem) {
            $output["feedback"] .= "\t•" . $missingItem["name"] . " (ID " . $missingItem["id"] . ")\n";
        }
        $output["errorTypes"][] = "missingItems";
        earlyExit($output);
    } else if (count($output["outOfStockItems"]) > 0) {
        $output["feedback"] = "There is insufficient stock for " . (count($output["outOfStockItems"]) === 1 ? "one" : "some") . " of the items requested at " . $input["locationName"] . ", please review your transaction and try again (stock levels have been refreshed):\n\n";
        $output["errorMessage"] = "Insufficient stock";
        $output["errorTypes"][] = "outOfStock";
        foreach ($output["outOfStockItems"] as $outOfStockItem) {
            $output["feedback"] .= "\t• " . $outOfStockItem["name"] . " - " . $outOfStockItem["requested"] . " requested, " . $outOfStockItem["current"] . " available\n";
        }
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
    $transactionQueries[] = array("query" => $addTransaction, "feedback" => $transaction["itemName"] . ($transaction["quantity"] >= 0 ? " restocked at " : " withdrawn from ") . $transaction["locationName"] . "\n");
}

$transactionFeedback = "";

foreach ($transactionQueries as $transactionQuery) {
    try {
        $transactionQuery["query"]->execute();
        updateCurrentStockLevel();
        $transactionFeedback .= $transactionQuery["feedback"];
    } catch (PDOException $e) {
        $output["feedback"] = $e->getMessage();
        $output["errorMessage"] = $e->getMessage();
        $output["errorTypes"][] = "queryError";
        $output["errorType"] = "queryError";
        earlyExit($output);
    }
}

$output["success"] = true;
$output["title"] = "Transactions complete";
$output["feedback"] = $input["transactionFormType"] === "transfer" ? ($input["transactionArray"][0]["itemName"] . " transferred from " . $input["locationName"] . " to " . $input["destinationName"]) : $transactionFeedback;

echo json_encode($output);

function earlyExit($output)
{
    echo json_encode($output);
    exit();
}