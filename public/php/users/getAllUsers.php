<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require '../vendor/autoload.php';

use Delight\Auth\Auth;

$auth = new Auth($db);

$output = array("users" => array(), "isOneOfManySuperAdmins" => false);
$getAllUsers = $db->prepare("
        SELECT users.email, users.verified, users_info.*, users_organisations.*
        FROM users
        LEFT JOIN users_info ON users.id = users_info.userId
        LEFT JOIN users_organisations ON users_info.organisationId = users_organisations.id
        WHERE users_info.organisationId = :organisationId");
$getAllUsers->bindParam(':organisationId', $_SESSION["user"]->organisationId);
$getAllUsers->execute();
$output["users"] = $getAllUsers->fetchAll(PDO::FETCH_ASSOC);

if ($auth->hasRole(\Delight\Auth\Role::SUPER_ADMIN)) {
    $isSuperAdminAndThereIsMoreThanOne = $db->prepare("SELECT COUNT(*) as result FROM `users_info` WHERE `superAdmin` = 1 AND `organisationId` = :organisationId");
    $isSuperAdminAndThereIsMoreThanOne->bindParam(':organisationId', $_SESSION["user"]->organisationId);
    $isSuperAdminAndThereIsMoreThanOne->execute();
    $output["isOneOfManySuperAdmins"] = $isSuperAdminAndThereIsMoreThanOne->fetchColumn(0) > 1;
}

//echo json_encode(processResult($getAllUsers->fetchAll(PDO::FETCH_ASSOC), array("verified", "approved", "admin", "superAdmin")));
echo json_encode($output);
