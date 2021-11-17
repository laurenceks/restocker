<?php
function fetchFunctionLists($organisationId, $locationId = null)
{
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
    $locationWhere = $locationId ? "AND transactions.locationId = :locationId" : "";
    $getAllLists = $db->prepare("SELECT 
    'all' as locationId,
    lists.id,
    lists.name AS listName,
    listitems.itemId,
    listitems.quantity,
    items.name,
    items.currentStock,
    items.warningLevel
    FROM lists
    LEFT JOIN listItems ON lists.id = listitems.listId
    LEFT JOIN items ON items.id = listitems.itemId
    LEFT JOIN transactions ON transactions.itemId = listitems.itemId
    WHERE lists.organisationId = :organisationId1 AND lists.deleted = 0 AND transactions.organisationId = :organisationId2
    GROUP BY lists.id, items.id
    
    UNION
    
    SELECT 
    transactions.locationId as locationId,
    lists.id,
    lists.name AS listName,
    listitems.itemId,
    listitems.quantity,
    items.name,
    CAST(SUM(transactions.quantity) AS INT) AS currentStock,
    items.warningLevel
    FROM lists
    LEFT JOIN listItems ON lists.id = listitems.listId
    LEFT JOIN items ON items.id = listitems.itemId
    LEFT JOIN transactions ON transactions.itemId = listitems.itemId
    WHERE lists.organisationId = :organisationId3 AND lists.deleted = 0 AND transactions.organisationId = :organisationId4
    GROUP BY transactions.locationId, lists.id, items.id;");

    $getAllLists->bindValue(':organisationId1', $organisationId);
    $getAllLists->bindValue(':organisationId2', $organisationId);
    $getAllLists->bindValue(':organisationId3', $organisationId);
    $getAllLists->bindValue(':organisationId4', $organisationId);
    $getAllLists->execute();
    if ($locationId) {
        $getAllLists->bindValue(':locationId', $locationId);
    }

    return $getAllLists->fetchAll(PDO::FETCH_ASSOC);
}