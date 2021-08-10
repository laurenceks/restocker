<?php
function getUserInfo($userId)
{
    require "db.php";
    $getUserInfo = $db->prepare("SELECT * FROM users_info WHERE userId = :userId");
    $getUserInfo->bindParam(':userId', $userId);
    $getUserInfo->execute();

    return $getUserInfo->fetch(PDO::FETCH_OBJ);
}
