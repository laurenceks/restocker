<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";


$input = json_decode(file_get_contents('php://input'), true);
targetHasSameOrganisationAsCurrentUser($input["userId"]);

$getAllUsers = $db->prepare("UPDATE users_info SET suspended = 0 WHERE id = :userId");
$getAllUsers->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($getAllUsers->execute()));