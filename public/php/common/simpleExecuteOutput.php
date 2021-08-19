<?php
function simpleExecuteOutput($exe)
{
    $output = array("success" => false, "feedback" => "An error occurred", "errorCode" => null);
    if ($exe) {
        $output["success"] = true;
        $output["feedback"] = "Executed successfully";
    }
    return $output;
}