<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "mail" => new stdClass(), "keepFormActive" => false);

try {
    $auth->forgotPassword($input["inputForgotEmail"], function ($selector, $token) use ($input, &$output) {
        require_once "../../common/sendSmtpMail.php";
        require_once "forgotEmail.php";
        require "../../common/getUserInfo.php";
        require "../../common/getUserIdFromSelector.php";

        $name = getUserInfo(getUserIdFromSelector($selector, "users_resets"))->firstName;
        $emailParams = composeForgotEmail($selector, $token, $name);
        $mailToSend = composeSmtpMail($input["inputForgotEmail"], $name, "Restocker password reset", $emailParams["message"], $emailParams["messageAlt"]);
        $output["mail"] = sendSmtpMail($mailToSend);
    });
    $output["success"] = true;
    $output["feedback"] = "Password reset email sent, please check " . $input["inputForgotEmail"] . " for a recovery link";
} catch (\Delight\Auth\InvalidEmailException $e) {
    $output["feedback"] = "Unknown email address, please check for typos or register";
    $output["errorMessage"] = "Unknown email address";
    $output["keepFormActive"] = true;
    $output["errorType"] = "unknownEmail";
} catch (\Delight\Auth\EmailNotVerifiedException $e) {
    $output["feedback"] = "Email not verified";
    $output["errorMessage"] = "Email not verified";
    $output["errorType"] = "unverifiedEmail";
} catch (\Delight\Auth\TooManyRequestsException $e) {
    $output["feedback"] = "There have been too many requests, please try again later";
    $output["errorMessage"] = "Too many requests";
    $output["errorType"] = "tooManyRequests";
}

echo json_encode($output);