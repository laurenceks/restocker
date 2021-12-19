<?php
require "../security/userLoginSecurityCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';
require "../common/feedbackTemplate.php";
require_once "../common/db.php";

use Delight\Auth\Auth;

$auth = new Auth($db);

$output = $feedbackTemplate;

try {
    $auth->admin()->addRoleForUserById(1, \Delight\Auth\Role::SUPER_ADMIN);
    $makeUserSuperAdmin = $db->prepare("UPDATE users_info SET admin = 1, superAdmin = 1 WHERE userId = 1");
    $output = simpleExecuteOutput($makeUserSuperAdmin);
} catch (\Delight\Auth\UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}

echo json_encode($output);