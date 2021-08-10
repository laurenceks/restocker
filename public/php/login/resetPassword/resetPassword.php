<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "input" => $input);

if (!$input || !$input['selector'] || !$input['token']) {
    $output["feedback"] = "Parameters did not reach server";
} else {
    try {
        $auth->resetPassword($input['selector'], $input['token'], $input['inputPasswordResetPassword']);

        //TODO send email notifying of password reset

        $output["feedback"] = 'Password has been reset';
        $output["success"] = true;
    } catch (\Delight\Auth\InvalidSelectorTokenPairException $e) {
        $output["feedback"] = "Invalid token";
    } catch (\Delight\Auth\TokenExpiredException $e) {
        $output["feedback"] = "Token expired";
    } catch (\Delight\Auth\InvalidPasswordException  $e) {
        $output["feedback"] = "Invalid password";
    } catch (\Delight\Auth\ResetDisabledException  $e) {
        $output["feedback"] = "Password resets are not allowed for this account - please contact your organisation's administrator";
    } catch (\Delight\Auth\TooManyRequestsException $e) {
        $output["feedback"] = "Too many requests - please try again later";
    }
}
echo json_encode($output);