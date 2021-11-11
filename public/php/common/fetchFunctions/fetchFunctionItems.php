<?php
function fetchFunctionItems($organisationId, $locationId = null)
{
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
    $locationWhere = $locationId ? "AND transactions.locationId = :locationId" : "";
    $getAllItems = $db->prepare('SELECT items.id,
                                   items.name,
                                   items.unit,
                                   "all" AS locationId,
                                   items.currentStock,
                                   items.warninglevel
                            FROM   items
                                   LEFT JOIN transactions
                                          ON items.id = transactions.itemid
                            GROUP  BY transactions.itemid
                            UNION
                            SELECT items.id,
                                   items.name,
                                   items.unit,
                                   transactions.locationid,
                                   CAST(SUM(quantity) AS INTEGER) AS currentStock,
                                   items.warninglevel
                            FROM   `items`
                                   LEFT JOIN transactions
                                          ON items.id = transactions.itemid
                            WHERE  items.organisationid = :organisationId1
                                   AND transactions.organisationid = :organisationId2'
                                    . "\n" . $locationWhere . "\n" .
                                    'GROUP  BY items.id,
                                      transactions.locationid
                            ORDER  BY locationid,
                                      id; ');
    $getAllItems->bindValue(':organisationId1', $organisationId);
    $getAllItems->bindValue(':organisationId2', $organisationId);
    if ($locationId) {
        $getAllItems->bindValue(':locationId', $locationId);
    }
    $getAllItems->execute();
    return $getAllItems->fetchAll( PDO::FETCH_ASSOC);
}