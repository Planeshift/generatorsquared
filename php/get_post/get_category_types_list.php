<?php

//establish the connection
require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

$response = [];

try{
    // Get the category_types list
    $sql =  "SELECT type
            FROM    category_types";

    $statement = $conn->prepare($sql);
    $statement->execute();
    $resultArray = $statement->fetchAll(PDO::FETCH_COLUMN);

    $json = json_encode($resultArray);
}
catch(PDOException $e){
    $json = json_encode($e->getMessage());

    echo "$json";

    return $json;
}

echo "$json";

return $json;
?> 