<?php
function getUserInfo($userId, $auth = null)
{
    require "db.php";
    $getUserInfo = $db->prepare("
        SELECT users.email, users_info.*, users_organisations.organisation
        FROM users
        LEFT JOIN users_info ON users.id = users_info.id
        LEFT JOIN users_organisations ON users_info.organisationId = users_organisations.id
        WHERE users.id = :userId
        ");
    $getUserInfo->bindParam(':userId', $userId);
    $getUserInfo->execute();

    $output = $getUserInfo->fetch(PDO::FETCH_OBJ);
    $output->roles = $auth ? array_values($auth->getRoles()) : null;
    return $output;
}
