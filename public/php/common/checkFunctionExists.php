<?php
function checkFunctionExists($table, $selectKey, $keyValues, $ignoreDeleted = false, $compareValues = false)
{
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";

    $result = false;
    $whiteList = array(
        "tables" => array("lists", "list_items", "items", "locations", "transactions"),
        "keys" => array("id", "name", "listId", "itemId")
    );

    if (count($keyValues) > 0 && in_array($table, $whiteList["tables"], true) && in_array($selectKey, $whiteList["keys"], true)) {
        $whereString = " WHERE";
        $i = 1;
        $j = 0;
        $k = 1;
        foreach ($keyValues as $pair) {
            if (in_array($pair["key"], $whiteList["keys"], true)) {
                $whereString .= ($j === 0 ? " " : " AND ") . $pair["key"] . " = :value" . $i;
                $j++;
            }
            $i++;
        }

        if ($j > 0) {
            $check = $db->prepare("SELECT " . $selectKey . " FROM " . $table . $whereString . ($ignoreDeleted ? "" : " AND deleted = 0"));
            foreach ($keyValues as $pair) {
                $check->bindValue(':value' . $k, $pair["value"]);
                $k++;
            }
            $check->execute();
            $result = $compareValues ? $check->fetchAll(PDO::FETCH_ASSOC)[0] === $keyValues[0]["value"] : count($check->fetchAll(PDO::FETCH_ASSOC)) > 0;
        }
    }

    return $result;
}