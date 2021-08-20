<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/processResult.php";

$input = json_decode(file_get_contents('php://input'), true);

$getAllUsers = $db->prepare("
        SELECT users.email, users.verified, users_info.*, users_organisations.*
        FROM users
        LEFT JOIN users_info ON users.id = users_info.userId
        LEFT JOIN users_organisations ON users_info.organisationId = users_organisations.id
        WHERE users_info.organisationId = :organisationId");
$getAllUsers->bindParam(':organisationId', $input["organisationId"]);
$getAllUsers->execute();

//echo json_encode(processResult($getAllUsers->fetchAll(PDO::FETCH_ASSOC), array("verified", "approved", "admin", "superAdmin")));
echo json_encode($getAllUsers->fetchAll(PDO::FETCH_ASSOC));
