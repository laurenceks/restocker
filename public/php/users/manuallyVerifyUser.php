<?php
require "../login/userLoginSecurityCheck.php";
require "../common/simpleExecuteOutput.php";

$input = json_decode(file_get_contents('php://input'), true);

$getAllUsers = $db->prepare("UPDATE users SET verified = 1 WHERE id = :userId");
$getAllUsers->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($getAllUsers->execute()));