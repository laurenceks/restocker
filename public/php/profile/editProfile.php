<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred");

try {
    if ($auth->reconfirmPassword($_POST['password'])) {
        $auth->changeEmail($_POST['newEmail'], function ($selector, $token) {
            echo 'Send ' . $selector . ' and ' . $token . ' to the user (e.g. via email to the *new* address)';
        });
        echo 'The change will take effect as soon as the new email address has been confirmed';
    }
    else {
        echo 'We can\'t say if the user is who they claim to be';
    }
}
catch (\Delight\Auth\InvalidEmailException $e) {
    die('Invalid email address');
}
catch (\Delight\Auth\UserAlreadyExistsException $e) {
    die('Email address already exists');
}
catch (\Delight\Auth\EmailNotVerifiedException $e) {
    die('Account not verified');
}
catch (\Delight\Auth\NotLoggedInException $e) {
    die('Not logged in');
}
catch (\Delight\Auth\TooManyRequestsException $e) {
    die('Too many requests');
}


echo json_encode($output);