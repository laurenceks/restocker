<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";

$output = array("items" => array());
$getAllItems = $db->prepare("
        SELECT * FROM items
        WHERE organisationId = :organisationId
        AND deleted = 0
        ");
$getAllItems->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllItems->execute();
$output["items"] = $getAllItems->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($output);
