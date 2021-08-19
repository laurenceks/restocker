<?php
require "../login/userLoginSecurityCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);
$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $auth->admin()->addRoleForUserById($input["userId"], \Delight\Auth\Role::SUPER_ADMIN);
    $makeUserAdmin = $db->prepare("UPDATE users_info SET superAdmin = 1 WHERE userId = :userId");
    $makeUserAdmin->bindParam(':userId', $input["userId"]);
    $output = simpleExecuteOutput($makeUserAdmin->execute());
} catch (\Delight\Auth\UnknownIdException $e) {
    $output["feedback"] = "Unknown user ID passed";
}

echo json_encode($output);