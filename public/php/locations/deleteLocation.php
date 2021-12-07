<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "title" => null);

if (!checkFunctionExists("locations", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["errorType"] = "locationMissing";
    $output["title"] = "Missing location";
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
} else {
    try {
        $deleteLocation = $db->prepare("UPDATE locations SET deleted = 1, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deleteLocation->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $deleteLocation->bindParam(":id", $input["id"]);
        $deleteLocation->bindValue(":uid", $_SESSION["user"]->userId);
        $deleteLocation->execute();
        $output["success"] = true;
        $output["title"] = "Location deleted";
        $output["feedback"] = $input["name"] . " was deleted successfully";
    } catch
    (PDOException $e) {
        echo $output["feedback"] = $e->getMessage();
    }
}

echo json_encode($output);