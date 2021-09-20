<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);
targetHasSameOrganisationAsCurrentUser($input["userId"]);
$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $auth->admin()->deleteUserById($input["userId"]);
    $denyUser = $db->prepare("DELETE FROM users_info WHERE userId = :userId;");
    $denyUser->bindParam(':userId', $input["userId"]);
    if ($denyUser->execute()) {
        $denyUser = $db->prepare('UPDATE users_confirmations SET email = CONCAT(SUBSTRING(email, 1, 1), REGEXP_REPLACE(SUBSTRING(email, 2, POSITION("@" IN email)-3), "[A-z]", "*"),SUBSTRING(email, POSITION("@" IN email)-1, 1), "@", SUBSTRING(email, POSITION("@" IN email)+1, 1), REGEXP_REPLACE(SUBSTRING(email, POSITION("@" IN email)+2, LENGTH(email) - POSITION("@" IN email)-2), "[A-z]", "*"), SUBSTRING(email, LENGTH(email), 1)) WHERE user_id = :userId');
        $denyUser->bindParam(':userId', $input["userId"]);
        if ($denyUser->execute()) {
            $output["success"] = true;
            $output["feedback"] = "User approval request denied and account deleted";
        } else {
            $output["feedback"] = "Unable to deny approval request";
        }
    } else {
        $output["feedback"] = "Unable to deny approval request";
    }

} catch (\Delight\Auth\UnknownIdException $e) {
    $output["feedback"] = "Unknown user ID passed";
}

echo json_encode($output);