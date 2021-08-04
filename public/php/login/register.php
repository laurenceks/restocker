<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $userId = $auth->register($input['inputRegisterEmail'], $input['inputRegisterPassword'], null, function ($selector, $token) {
        //echo 'Send ' . $selector . ' and ' . $token . ' to the user (e.g. via email)';
        //send verification email here
        $url = __DIR__ . 'verify_email?selector=' . \urlencode($selector) . '&token=' . \urlencode($token);

    });

    $output["success"] = true;
    $output["feedback"] = "You have successfully registered, please check " . $input["inputRegisterEmail"] . " for a verification link";
    $output["id"] = $userId;
} catch (\Delight\Auth\InvalidEmailException $e) {
    $output["feedback"] = "Invalid email address";
} catch (\Delight\Auth\InvalidPasswordException $e) {
    $output["feedback"] = "Invalid password";
} catch (\Delight\Auth\UserAlreadyExistsException $e) {
    $output["feedback"] = "User already exists";
} catch (\Delight\Auth\TooManyRequestsException $e) {
    $output["feedback"] = "Too many requests";
}

echo json_encode($output);