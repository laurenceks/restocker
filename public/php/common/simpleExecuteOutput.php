<?php
function simpleExecuteOutput($exe, $output = array())
{
    require "../common/feedbackTemplate.php";
    $output = array_merge($feedbackTemplate, $output, array("errorCode" => null));
    try {
        $exe->execute();
        $output["success"] = true;
        $output["title"] = $output["title"] === "Error" ? "Operation complete" : $output["title"];
        $output["feedback"] = $output["feedback"] === "An unknown error occurred" ? "The operation was completed successfully" : $output["feedback"];
    } catch (PDOException $e) {
        $output["feedback"] = $e->getMessage();
        $output["errorMessage"] = $e->getMessage();
        $output["errorTypes"][] = "queryError";
        $output["errorType"] = "queryError";
    }
    return $output;
}