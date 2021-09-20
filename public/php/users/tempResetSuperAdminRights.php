<?php
require "../security/userLoginSecurityCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";

$auth = new Auth($db);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $auth->admin()->addRoleForUserById(1, \Delight\Auth\Role::SUPER_ADMIN);
    $makeUserSuperAdmin = $db->prepare("UPDATE users_info SET admin = 1, superAdmin = 1 WHERE userId = 1");
    $output = simpleExecuteOutput($makeUserSuperAdmin->execute());
} catch (\Delight\Auth\UnknownIdException $e) {
    $output["feedback"] = "Unknown user ID passed";
}

echo json_encode($output);