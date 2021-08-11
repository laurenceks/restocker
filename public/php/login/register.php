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

        $emailParams = composeVerificationEmail($selector, $token, $input["inputRegisterFirstName"]);
        $mailToSend = composeSmtpMail($input['inputRegisterEmail'], $input['inputRegisterFirstName'] . " " . $input['inputRegisterLastName'], "Verify your Restocker account", $emailParams["message"], $emailParams["messageAlt"]);
        $output["mail"] = sendSmtpMail($mailToSend);
    });
    try {
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $role = "user";
        $organisationId = isset($input["organisationId"]) ? $input["organisationId"] : null;

        if (!$organisationId) {
            //no organisation - create it and set user to admin
            $role = "admin";
            $addOrganisation = $db->prepare("INSERT INTO users_organisations (organisation) VALUES (:organisation)");
            $addOrganisation->bindParam(":organisation", $input["inputRegisterOrganisation"]);
            $addOrganisation->execute();
            $organisationId = $db->lastInsertId();
            $output["organisationId"] = $organisationId;
        }


        $addUserInfo = $db->prepare("INSERT INTO users_info (userId, firstName, lastName, role, organisationId) VALUES (:userId, :firstname, :lastname, :role, :organisationId)");
        $addUserInfo->bindParam(':userId', $userId);
        $addUserInfo->bindParam(':firstname', $input['inputRegisterFirstName']);
        $addUserInfo->bindParam(':lastname', $input['inputRegisterLastName']);
        $addUserInfo->bindParam(':role', $role);
        $addUserInfo->bindParam(':organisationId', $organisationId);

        $addUserInfo->execute();

    } catch (PDOException $e) {
        echo $output["feedback"] = $e->getMessage();
    }

    if (!isset($input["organisationId"])) {
        try {
            $auth->admin()->addRoleForUserById($userId, \Delight\Auth\Role::ADMIN);
        } catch (\Delight\Auth\UnknownIdException $e) {
            $output["feedback"] = "Unable to assign user admin role, please contact the support team";
        }
    }

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