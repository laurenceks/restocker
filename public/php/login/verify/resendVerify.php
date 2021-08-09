<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "mail" => new stdClass());

try {
    $auth->resendConfirmationForEmail($input["inputReVerifyEmail"], function ($selector, $token) use ($input, $output) {
        require_once "../../common/sendSmtpMail.php";
        require_once "verificationEmail.php";

        //TODO: get name from DB;
        $name = null;

        $emailParams = composeVerificationEmail($input, $selector, $token);
        $mailToSend = composeSmtpMail($input['inputReVerifyEmail'], $name, "Verify your Restocker account", $emailParams["message"], $emailParams["messageAlt"]);
        $output["mail"] = sendSmtpMail($mailToSend);
    });
    $output["success"] = true;
    $output["feedback"] = "Verification email re-sent, please check " . $input["inputReVerifyEmail"] . " for a verification link";
} catch (\Delight\Auth\ConfirmationRequestNotFound $e) {
    $output["feedback"] = "Unknown email address, please register";
} catch (\Delight\Auth\TooManyRequestsException $e) {
    $output["feedback"] = "There have been too many requests, please try again later";
}

echo json_encode($output);