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
        $auth->confirmEmail($input['selector'], $input['token']);

        $output["feedback"] = 'Email address has been verified';
        $output["success"] = true;
    } catch (\Delight\Auth\InvalidSelectorTokenPairException $e) {
        $output["feedback"] = "Invalid token";
    } catch (\Delight\Auth\TokenExpiredException $e) {
        $output["feedback"] = "Token expired";
    } catch (\Delight\Auth\UserAlreadyExistsException $e) {
        $output["feedback"] = "Email address already verified";
    } catch (\Delight\Auth\TooManyRequestsException $e) {
        $output["feedback"] = "Too many requests";
    }
}
echo json_encode($output);