<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";

$output = array("items" => array());
$getAllLocations = $db->prepare("
SELECT 
  *, 
  (
    SELECT 
      CAST(SUM(transactions.quantity) AS INTEGER)
    FROM 
      transactions 
    WHERE 
      organisationId = :organisationId1 
      AND deleted = 0 
      AND locationId = locations.id
  ) AS currentStock
FROM 
  locations 
WHERE 
  locations.organisationId = :organisationId2 
  AND locations.deleted = 0;
");
$getAllLocations->bindValue(':organisationId1', $_SESSION["user"]->organisationId);
$getAllLocations->bindValue(':organisationId2', $_SESSION["user"]->organisationId);
$getAllLocations->execute();
$output["locations"] = $getAllLocations->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($output);
