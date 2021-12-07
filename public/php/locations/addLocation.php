<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "title" => null);

if (checkFunctionExists("locations", "id", array(array("key" => "name", "value" => $input["inputAddLocationName"])))) {
    $output["errorType"] = "locationExists";
    $output["title"] = "Location already exists";
    $output["feedback"] = "A location with that name already exists, please change the location name and try again";
} else {
    try {
        $addLocation = $db->prepare("INSERT INTO locations (organisationId, name, createdBy, editedBy) VALUES (:organisationId,:name, :uid1, :uid2)");
        $addLocation->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addLocation->bindParam(":name", $input["inputAddLocationName"]);
        $addLocation->bindValue(":uid1", $_SESSION["user"]->userId);
        $addLocation->bindValue(":uid2", $_SESSION["user"]->userId);
        $addLocation->execute();
        $output["success"] = true;
        $output["title"] = "Location added";
        $output["feedback"] = $input["inputAddLocationName"] . " was added successfully";
    } catch
    (PDOException $e) {
        echo $output["feedback"] = $e->getMessage();
    }
}

echo json_encode($output);