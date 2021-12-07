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
} else if (checkFunctionExists("locations", "name", array(array("key" => "name", "value" => $input["name"])), false, true)) {
    $output["errorType"] = "locationExists";
    $output["title"] = "Location already exists";
    $output["feedback"] = "A location with that name already exists, please change the location name and try again";
} else {
    try {
        $editLocation = $db->prepare("UPDATE locations SET name = :name, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $editLocation->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editLocation->bindParam(":name", $input["name"]);
        $editLocation->bindParam(":id", $input["id"]);
        $editLocation->bindValue(":uid", $_SESSION["user"]->userId);
        $editLocation->execute();
        $output["success"] = true;
        $output["title"] = "Location updated";
        $output["feedback"] = $input["name"] . " was updated successfully";
    } catch
    (PDOException $e) {
        echo $output["feedback"] = $e->getMessage();
    }
}

echo json_encode($output);