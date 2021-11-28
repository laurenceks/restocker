<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";

$output = array("items" => array());
$getAllLocations = $db->prepare("
        SELECT * FROM locations
        WHERE organisationId = :organisationId
        AND deleted = 0
        ");
$getAllLocations->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllLocations->execute();
$output["locations"] = $getAllLocations->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($output);
