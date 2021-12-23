<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("locations" => array()));
$getAllLocations = $db->prepare("
SELECT 
  *, 
  (
    SELECT 
      CAST(SUM(transactions.quantity) AS UNSIGNED)
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
$output["success"] = true;
$output["title"] = "Locations updated";
$output["feedback"] = "Locations data has been refreshed";

echo json_encode($output);
