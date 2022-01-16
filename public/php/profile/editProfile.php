<?php

require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/feedbackTemplate.php";

use Delight\Auth\Auth;

$auth = new Auth($db);
$id = $auth->getUserId();

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!$id = $_SESSION["user"]->id) {
    //not the same user as logged in - shouldn't be possible
    $output["feedback"] = "A user can only update their own profile";
    $output["errorMessage"] = "A user can only update their own profile";
    $output["errorType"] = "userIdMismatch";
} else {
    try {
        $editItem = $db->prepare("UPDATE users_info SET firstName = :firstName, lastName = :lastName WHERE id = :id AND organisationId = :organisationId");
        $editItem->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editItem->bindParam(":firstName", $input["inputProfileFirstName"]);
        $editItem->bindParam(":lastName", $input["inputProfileLastName"]);
        $editItem->bindParam(":id", $id);
        $editItem->execute();
        $output["success"] = true;
        $output["title"] = "Profile updated";
        $output["feedback"] = $input["inputProfileFirstName"] . "'s profile was updated successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}


echo json_encode($output);