<?php
    require "../common/feedbackTemplate.php";
function simpleExecuteOutput($exe, $feedbackMessage)
{
    $output = array_merge($feedbackTemplate, array("errorCode" => null));
    if ($exe) {
        $output["success"] = true;
        $output["feedback"] = $feedbackMessage || "Executed successfully";
    }
    return $output;
}