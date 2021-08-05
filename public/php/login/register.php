<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;


require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "mail" => new stdClass());

try {
    $userId = $auth->register($input['inputRegisterEmail'], $input['inputRegisterPassword'], null, function ($selector, $token) use ($input, $output) {

        require_once "../common/sendSmtpMail.php";

        $serverString = ($_SERVER['SERVER_NAME'] == "localhost" ? "http://" : "https://") . $_SERVER['SERVER_NAME'] . ($_SERVER['SERVER_NAME'] == "localhost" ? ":3000/#" : "");
        $url = $serverString . '/verify?selector=' . \urlencode($selector) . '&token=' . \urlencode($token);
        $messageAlt = "Please copy and paste the below link into your browser to verify your Restocker account.\n\r\n\r" . $url;
        $message = file_get_contents('verifyHTMLTemplate.html', __DIR__);
        $message=  mb_convert_encoding($message, 'HTML-ENTITIES', "UTF-8");
        $message = str_replace("%URL%", $url, $message);
        $message = str_replace("%USER%", $input["inputRegisterFirstName"], $message);

        $mailToSend = composeSmtpMail($input['inputRegisterEmail'], $input['inputRegisterFirstName'] . " " . $input['inputRegisterLastName'], $message, $messageAlt);

        if (!$mailToSend->send()) {
            $output["mail"]->status = "fail";
            $output["mail"]->success = false;
            $output["mail"]->response = $mailToSend->ErrorInfo;
        } else {
            $output["mail"]->status = "success";
            $output["mail"]->success = true;
            $output["mail"]->response = "Message sent successfully";
        }
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