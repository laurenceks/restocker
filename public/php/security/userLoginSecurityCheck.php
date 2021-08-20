<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";
$auth = new Auth($db);

if (!$auth->isLoggedIn()) {
    endProcessDueToInvalidLogin("User not logged in");
} else {
    $msg = "User login invalid";
    $uid = $auth->getUserId();
    $loginSecondaryChecks = $db->prepare("SELECT users.verified, users_info.approved, users_info.suspended FROM users LEFT JOIN users_info ON users.id = users_info.userId WHERE userId = :userId");
    $loginSecondaryChecks->bindParam(":userId", $uid);
    $loginSecondaryChecks->execute();
    $u = $loginSecondaryChecks->fetch(PDO::FETCH_OBJ);
    if (!$u->verified || !$u->approved || $u->suspended) {
        if ($u->suspended) {
            $msg = "User has been suspended";
        } else if (!$u->approved) {
            $msg = "User is not approved";
        } else {
            $msg = "User is not verified";
        }
        endProcessDueToInvalidLogin($msg);;
    }
}

function endProcessDueToInvalidLogin($msg)
{
    //user not logged in or login status invalid - proceed no further
    echo json_encode(array("failedLoginCheck" => true, "errorMessage" => $msg));
    die();
}