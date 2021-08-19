<?php
require "../login/userLoginSecurityCheck.php";
require "../common/simpleExecuteOutput.php";

$input = json_decode(file_get_contents('php://input'), true);

$getAllUsers = $db->prepare("UPDATE users_info SET approved = 1 WHERE userId = :userId");
$getAllUsers->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($getAllUsers->execute()));