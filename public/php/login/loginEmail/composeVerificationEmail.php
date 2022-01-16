<?php
function composeVerificationEmail($token, $selector, $name = null) {
    require "composeLoginEmail.php";
    require "../../common/appConfig.php";
    $verifyUrl = '/verify?selector=' . urlencode($selector) . '&token=' . urlencode($token);
    return composeLoginEmail(array("headline" => "Verify your " . $appName . " account", "subheadline" => "Thanks for signing up, " . $name, "body" => "Verify your " . $appName . " account by clicking on the link below:", "buttonText" => "Verify", "url" => $verifyUrl, "alt" => "Please copy and paste the below link into your browser to verify your " . $appName . " account.\n\r\n\r" . $verifyUrl));
}
