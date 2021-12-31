<?php
function composeVerificationEmail($token, $selector, $name = null)
{
    require "composeLoginEmail.php";
    $verifyUrl = '/verify?selector=' . \urlencode($selector) . '&token=' . \urlencode($token);
    return composeLoginEmail(array(
        "headline" => "Verify your Restocker account",
        "subheadline" => "Thanks for signing up, " . $name,
        "body" => "Verify your Restocker account by clicking on the link below:",
        "buttonText" => "Verify",
        "url" => $verifyUrl,
        "alt" => "Please copy and paste the below link into your browser to verify your Restocker account.\n\r\n\r" . $verifyUrl
    ));
}

;
