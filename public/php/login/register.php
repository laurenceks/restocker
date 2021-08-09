<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;


require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "mail" => new stdClass());

try {
    $userId = $auth->register($input['inputRegisterEmail'], $input['inputRegisterPassword'], null, function ($selector, $token) use ($input, &$output) {

        require_once "../common/sendSmtpMail.php";
        require_once "verify/verificationEmail.php";

        $emailParams = composeVerificationEmail($input, $selector, $token);
        $mailToSend = composeSmtpMail($input['inputRegisterEmail'], $input['inputRegisterFirstName'] . " " . $input['inputRegisterLastName'], "Verify your Restocker account", $emailParams["message"], $emailParams["messageAlt"]);
        $output["mail"] = sendSmtpMail($mailToSend);
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
    $output["feedback"] = "Too many requests - please try again later";
}

echo json_encode($output);