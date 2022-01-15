<?php
function endProcessDueToInvalidLogin($msg)
{
    //user not logged in or login status invalid - proceed no further
    echo json_encode(array("failedLoginCheck" => true, "errorMessage" => $msg));
    require "../login/logout.php"; //TODO check is this going to a cause an error by running logout twice?
    die();
}

