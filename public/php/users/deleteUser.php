<?php
require "../security/userLoginSecurityCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";

$auth = new Auth($db);


$input = json_decode(file_get_contents('php://input'), true);
$output = array("success" => false, "feedback" => "An unknown error occurred");
$targetIsSuperAdmin = false;
$targetIsAdmin = false;
$currentIsSuperAdmin = $auth->admin()->doesUserHaveRole($auth->getUserId(), \Delight\Auth\Role::SUPER_ADMIN);
$currentIsAdmin = $auth->admin()->doesUserHaveRole($auth->getUserId(), \Delight\Auth\Role::ADMIN);
$sameUser = !(int)$input["userId"] === $auth->getUserId();
if (!$sameUser) {
    require "../security/userAdminRightsCheck.php";
}
try {
    $targetIsSuperAdmin = $auth->admin()->doesUserHaveRole($input["userId"], \Delight\Auth\Role::SUPER_ADMIN);
} catch (\Delight\Auth\UnknownIdException $e) {
    $output["feedback"] = "Unknown user ID passed";
}
try {
    $targetIsAdmin = $auth->admin()->doesUserHaveRole($input["userId"], \Delight\Auth\Role::ADMIN);
} catch (\Delight\Auth\UnknownIdException $e) {
    $output["feedback"] = "Unknown user ID passed";
}

try {
    if (!$targetIsSuperAdmin && !$targetIsAdmin && ($currentIsAdmin || $currentIsSuperAdmin)
        || $targetIsAdmin && $currentIsSuperAdmin
        || $sameUser
    ) {
        //only delete if the target user is
        //- not an admin/superAdmin and the current user is an admin
        //- an admin but the current user is a super admin
        //- is the one being deleted
        try {
            //TODO move delete operation into separate func file for consistency
            $auth->admin()->deleteUserById($input["userId"]);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
            $deleteUserFromDb = $db->prepare("UPDATE `users_confirmations` SET email = CONCAT(SUBSTRING(email, 1, 1), REGEXP_REPLACE(SUBSTRING(email, 2, POSITION('@' IN email)-3), '[A-z]', '*'),SUBSTRING(email, POSITION('@' IN email)-1, 1), '@', SUBSTRING(email, POSITION('@' IN email)+1, 1), REGEXP_REPLACE(SUBSTRING(email, POSITION('@' IN email)+2, LENGTH(email) - POSITION('@' IN email)-2), '[A-z]', '*'), SUBSTRING(email, LENGTH(email), 1)) WHERE user_id =  :userId; DELETE FROM `users_info` WHERE userId =  :userId; DELETE FROM `users_resets` WHERE user =  :userId; ");
            $deleteUserFromDb->bindValue(':userId', $input["userId"]);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $output = simpleExecuteOutput($deleteUserFromDb->execute());
        } catch (\Delight\Auth\UnknownIdException $e) {
            $output["feedback"] = "Unknown user ID passed";
        }
    } else {
        if ($targetIsSuperAdmin) {
            $output["feedback"] = "A super admin can only delete themselves or be deleted once demoted";
        } else if ($targetIsAdmin && !$currentIsSuperAdmin) {
            $output["feedback"] = "An admin can only be deleted by a super admin or themselves";
        } else if (!$currentIsAdmin && !$currentIsSuperAdmin && !$sameUser) {
            $output["feedback"] = "Admin rights are needed to delete users other than yourself";
        } else {
            $output["feedback"] = "An unknown permissions error occurred";
        }
    }
} catch (\Delight\Auth\UnknownIdException $e) {
    $output["feedback"] = "Unknown user ID passed";
}

echo json_encode($output);