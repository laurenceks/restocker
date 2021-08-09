<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $auth->login($input['inputLoginEmail'], $input['inputLoginPassword']);
    $output["success"] = true;
    $output["feedback"] = "User is logged in";
} catch (\Delight\Auth\InvalidEmailException $e) {
    $output["feedback"] = "Wrong or unknown email/password";
} catch (\Delight\Auth\InvalidPasswordException $e) {
    $output["feedback"] = "Wrong or unknown email/password";
} catch (\Delight\Auth\EmailNotVerifiedException $e) {
    $output["feedback"] = "Email not verified";
} catch (\Delight\Auth\TooManyRequestsException $e) {
    $output["feedback"] = "Too many requests - please try again later";
}

echo json_encode($output);