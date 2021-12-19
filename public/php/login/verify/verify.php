<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "input" => $input);

if (!$input || !$input['selector'] || !$input['token']) {
    $output["feedback"] = "Parameters did not reach server";
    $output["errorMessage"] = "Parameters did not reach server";
    $output["errorType"] = "noParameters";
} else {
    try {
        $auth->confirmEmail($input['selector'], $input['token']);

        $output["feedback"] = "Email address has been verified";
        $output["success"] = true;
    } catch (\Delight\Auth\InvalidSelectorTokenPairException $e) {
        $output["feedback"] = "Invalid token";
        $output["errorMessage"] = "Invalid token";
        $output["errorType"] = "invalidToken";
    } catch (\Delight\Auth\TokenExpiredException $e) {
        $output["feedback"] = "Token expired";
        $output["errorMessage"] = "Token expired";
        $output["errorType"] = "tokenExpired";
    } catch (\Delight\Auth\UserAlreadyExistsException $e) {
        $output["feedback"] = "Email address already verified";
        $output["errorMessage"] = "Email address already verified";
        $output["errorType"] = "emailAlreadyVerified";
    } catch (\Delight\Auth\TooManyRequestsException $e) {
        $output["feedback"] = "Too many requests - please try again later";
        $output["errorMessage"] = "Too many requests";
        $output["errorType"] = "tooManyRequests";
    }
}
echo json_encode($output);