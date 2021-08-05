<?php
function sendVerificationEmail($mailToSend)
{
    $output = new stdClass();
    if (!$mailToSend->send()) {
        $output->status = "fail";
        $output->success = false;
        $output->response = $mailToSend->ErrorInfo;
    } else {
        $output->status = "success";
        $output->success = true;
        $output->response = "Message sent successfully";
    }
    return $output;
}