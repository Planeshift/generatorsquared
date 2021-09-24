<?php

//establish the connection
require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

// TODO: fetchAll is really not the best here, should switch it to the proper fetch (fetchclass?)

$response = new stdClass();

try{
    $id = $_REQUEST["id"];

    $sql =  "SELECT   PK_template_id as id,
                    title
            FROM      template 
            WHERE     PK_template_id = :id;";

    $statement = $conn->prepare($sql);
    $statement->execute(array(":id"=>$id));
    $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
}
catch(PDOException $e){
    $json = json_encode($e->getMessage());

    echo "$json";

    return $json;
}

$response = $resultArray[0];

try{
    $sql =  "SELECT   PK_category_id as id,
                    title,
                    type,
                    number_min,
                    number_max,
                    decimals,
                    help
            FROM      category
            WHERE     FK_template_id = :id
            ORDER BY  category.list_order;";

    $statement = $conn->prepare($sql);
    $statement->execute(array(":id"=>$id));
    $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
}
catch(PDOException $e){
    $json = json_encode($e->getMessage());

    echo "$json";

    return $json;
}

$response->categories = $resultArray;

try{
    $sql = "SELECT  element.PK_element_id as id,
                    element.title as title,
                    element.help as help,
                    element.FK_category_id as category_id
            FROM    element
            INNER JOIN category ON element.FK_category_id = category.PK_category_id
            AND category.FK_template_id = :id
            ORDER BY element.list_order;";

    $statement = $conn->prepare($sql);
    $statement->execute(array(":id"=>$id));
    $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
}
catch(PDOException $e){
    $json = json_encode($e->getMessage());

    echo "$json";

    return $json;
}

$response->elements = $resultArray;

$json = json_encode($response);

echo "$json";

return $json;
?> 