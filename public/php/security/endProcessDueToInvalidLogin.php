<?php
function endProcessDueToInvalidLogin($msg)
{
    //user not logged in or login status invalid - proceed no further
    echo json_encode(array("failedLoginCheck" => true, "errorMessage" => $msg));
    //TODO force logout?
    die();
}

