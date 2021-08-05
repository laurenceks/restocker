<?php
function composeVerificaitonEmail($input, $selector, $token)
{
    $serverString = ($_SERVER['SERVER_NAME'] == "localhost" ? "http://" : "https://") . $_SERVER['SERVER_NAME'] . ($_SERVER['SERVER_NAME'] == "localhost" ? ":3000/#" : "");
    $url = $serverString . '/verify?selector=' . \urlencode($selector) . '&token=' . \urlencode($token);
    $messageAlt = "Please copy and paste the below link into your browser to verify your Restocker account.\n\r\n\r" . $url;
    $message = file_get_contents('verifyHTMLTemplate.html', __DIR__);
    $message = mb_convert_encoding($message, 'HTML-ENTITIES', "UTF-8");
    $message = str_replace("%URL%", $url, $message);
    $message = str_replace("%USER%", $input["inputRegisterFirstName"], $message);

    return array("serverString" => $serverString, "url" => $url, "messageAlt" => $messageAlt, "message" => $message);
}