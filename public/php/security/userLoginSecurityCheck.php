<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";
$auth = new Auth($db);

if (!$auth->isLoggedIn()) {
    //user not logged in - proceed no further
    echo json_encode(array("failedLoginCheck" => true, "errorMessage" => "User not logged in"));
    die();
}