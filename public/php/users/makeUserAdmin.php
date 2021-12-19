<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';
require "../security/userSameOrganisationAsTargetCheck.php";
require_once "../common/db.php";
require "../common/feedbackTemplate.php";

use Delight\Auth\Auth;

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);
targetHasSameOrganisationAsCurrentUser($input["userId"]);
$output = $feedbackTemplate;
$targetIsSuperAdmin = false;

try {
    $targetIsSuperAdmin = $auth->admin()->doesUserHaveRole($input["userId"], \Delight\Auth\Role::SUPER_ADMIN);
} catch (\Delight\Auth\UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}
try {
    if (!$targetIsSuperAdmin || ($targetIsSuperAdmin && (int)$input["userId"] === $auth->getUserId())) {
        $auth->admin()->addRoleForUserById($input["userId"], \Delight\Auth\Role::ADMIN);
        $auth->admin()->removeRoleForUserById($input["userId"], \Delight\Auth\Role::SUPER_ADMIN);
        $makeUserAdmin = $db->prepare("UPDATE users_info SET admin = 1, superAdmin = 0 WHERE userId = :userId");
        $makeUserAdmin->bindParam(':userId', $input["userId"]);
        $output = simpleExecuteOutput($makeUserAdmin->execute());
    } else {
        $output["feedback"] = "A super admin can only renounce their own super admin rights";
    }
} catch (\Delight\Auth\UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}

echo json_encode($output);