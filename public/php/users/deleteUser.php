<?php
require "../security/userLoginSecurityCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';
require_once "../common/db.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);


use Delight\Auth\Auth;

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);
$output = $feedbackTemplate;
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
    $output = array_merge($output, $unknownUserIdOutput);
}
try {
    $targetIsAdmin = $auth->admin()->doesUserHaveRole($input["userId"], \Delight\Auth\Role::ADMIN);
} catch (\Delight\Auth\UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
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
            require "../security/userSameOrganisationAsTargetCheck.php";
            targetHasSameOrganisationAsCurrentUser($input["userId"]);
            //TODO move delete operation into separate func file for consistency
            $auth->admin()->deleteUserById($input["userId"]);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
            $deleteUserFromDb = $db->prepare("UPDATE `users_confirmations` SET email = CONCAT(SUBSTRING(email, 1, 1), REGEXP_REPLACE(SUBSTRING(email, 2, POSITION('@' IN email)-3), '[A-z]', '*'),SUBSTRING(email, POSITION('@' IN email)-1, 1), '@', SUBSTRING(email, POSITION('@' IN email)+1, 1), REGEXP_REPLACE(SUBSTRING(email, POSITION('@' IN email)+2, LENGTH(email) - POSITION('@' IN email)-2), '[A-z]', '*'), SUBSTRING(email, LENGTH(email), 1)) WHERE user_id = :userId; DELETE FROM `users_info` WHERE userId =  :userId; DELETE FROM `users_resets` WHERE user = :userId; ");
            $deleteUserFromDb->bindValue(':userId', $input["userId"]);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $output = simpleExecuteOutput($deleteUserFromDb);
        } catch (\Delight\Auth\UnknownIdException $e) {
            $output = array_merge($output, $unknownUserIdOutput);
        }
    } else {
        $output["title"] = "Forbidden";
        if ($targetIsSuperAdmin) {
            $output["feedback"] = "A super admin can only delete themselves or be deleted once demoted";
            $output["errorMessage"] = "A super admin can only delete themselves or be deleted once demoted";
            $output["errorType"] = "targetIsSuperAdmin";
        } else if ($targetIsAdmin && !$currentIsSuperAdmin) {
            $output["feedback"] = "An admin can only be deleted by a super admin or themselves";
            $output["title"] = "Forbidden";
            $output["errorMessage"] = "An admin can only be deleted by a super admin or themselves";
            $output["errorType"] = "targetIsSuperAdminAndUserIsNotSuperAdmin";
        } else if (!$currentIsAdmin && !$currentIsSuperAdmin && !$sameUser) {
            $output["feedback"] = "Admin rights are needed to delete users other than yourself";
            $output["errorMessage"] = "Admin rights are needed to delete users other than yourself";
            $output["errorType"] = "userIsNotAdmin";
        } else {
            $output["feedback"] = "An unknown permissions error occurred";
            $output["errorMessage"] = "An unknown permissions error occurred";
            $output["errorType"] = "unknownPermissionsError";
        }
    }
} catch (\Delight\Auth\UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}

echo json_encode($output);