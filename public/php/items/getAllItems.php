<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("items" => array()));

$getAllItems = $db->prepare("
        SELECT * FROM items
        WHERE organisationId = :organisationId
        AND deleted = 0
        ");
$getAllItems->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllItems->execute();
$output["success"] = true;
$output["title"] = "Items updated";
$output["feedback"] = "Items data has been refreshed";
$output["items"] = $getAllItems->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($output);
