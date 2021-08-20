<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    $rememberDuration = $input["inputLoginRemember"] == "true" ? 60 * 60 * 48 : null;
    $auth->login($input['inputLoginEmail'], $input['inputLoginPassword'], $rememberDuration);
    require_once "../common/getUserInfo.php";
    try {
        $output["user"] = getUserInfo($auth->getUserId(), $auth);
        if ($output["user"]->approved && !$output["user"]->suspended) {
            $output["success"] = true;
            $output["feedback"] = "User is logged in";
        } else if (!$output["user"]->approved) {
            $output["success"] = false;
            $output["feedback"] = "Your account is pending approval by an organisation admin";
        }else if ($output["user"]->suspended) {
            $output["success"] = false;
            $output["feedback"] = "Your account has been suspended by an organisational admin";
        }else{
            $output["success"] = false;
            $output["feedback"] = "Your account credentials are invalid - please contact an organisational admin";
        }
    } catch (exception $e) {
        $output["feedback"] = $e->getMessage();
    }

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