<?php
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
use Delight\Auth\Auth;


require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "mail"=>new stdClass());

try {
    $userId = $auth->register($input['inputRegisterEmail'], $input['inputRegisterPassword'], null, function ($selector, $token) use ($input, $output) {

        //mail setup
        require '../common/smtpCredentials.php';

        $emailFrom = "noreply@restocker.com";
        $emailFromName = "Restocker user registration";
        $headers = "From: Restocker user registration <noreply@restocker.com>";
        $headers .= "Reply-To: noreply@restocker.com";
        $url = __DIR__ . '/verify_email?selector=' . \urlencode($selector) . '&token=' . \urlencode($token);
        $message = "Please click the link below to verify your Restocker account.\n\n" . $url;

        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->SMTPDebug = 0; // 0 = off (for production use) - 1 = client messages - 2 = client and server messages
        $mail->Host = "smtp.gmail.com"; // use $mail->Host = gethostbyname('smtp.gmail.com'); // if your network does not support SMTP over IPv6
        $mail->Port = 587; // TLS only
        $mail->SMTPSecure = 'tls'; // ssl is depracated
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUsername;
        $mail->Password = $smtpPassword;
        $mail->setFrom($emailFrom, $emailFromName);
        $mail->addAddress($input['inputRegisterEmail'], $input['inputRegisterFirstName'] . " " . $input['inputRegisterLastName']);
        $mail->Subject = 'Verify your Restocker account ';
        $mail->msgHTML(str_replace("\r\n", "<br>", $message)); //$mail->msgHTML(file_get_contents('contents.html'), __DIR__); //Read an HTML message body from an external file, convert referenced images to embedded,
        $mail->AltBody = $message;

        if (!$mail->send()) {
            $output["mail"]->status = "fail";
            $output["mail"]->success = false;
            $output["mail"]->response = $mail->ErrorInfo;
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