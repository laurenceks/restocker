<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "mail" => new stdClass());

try {
    $auth->forgotPassword($input["inputForgotEmail"], function ($selector, $token) use ($input, &$output) {
        require_once "../../common/sendSmtpMail.php";
        require_once "forgotEmail.php";

        //TODO: get name from DB;
        $name = null;

        $emailParams = composeForgotEmail($input, $selector, $token);
        $mailToSend = composeSmtpMail($input["inputForgotEmail"], $name, "Recover your Restocker account", $emailParams["message"], $emailParams["messageAlt"]);
        $output["mail"] = sendSmtpMail($mailToSend);
    });
    $output["success"] = true;
    $output["feedback"] = "Password reset email sent, please check " . $input["inputForgotEmail"] . " for a recovery link";
} catch (\Delight\Auth\ConfirmationRequestNotFound $e) {
    $output["feedback"] = "Unknown email address, please register";
} catch (\Delight\Auth\TooManyRequestsException $e) {
    $output["feedback"] = "There have been too many requests, please try again later";
}

echo json_encode($output);