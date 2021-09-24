<?php

session_start();

//establish the connection
require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

$response = [];

$getDefaultList = $_GET["defaultList"] === "true";
$getUserList = $_GET["userList"] === "true";

$resultArray = [];

if($getDefaultList){

    try{
    // get the default template list
    $sql =  "SELECT PK_template_id as id,  
                    title
            FROM    template
            WHERE FK_user_id = 0;";

    $statement = $conn->prepare($sql);
    $statement->execute();
    $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
    }
    catch(PDOException $e){
        $json = json_encode($e->getMessage());

        echo "$json";

        return $json;
    }
}

if($getUserList){
    if(isset($_SESSION["user_id"])){

        try{
            $sql =  "SELECT PK_template_id as id,  
                        title
                FROM    template
                WHERE FK_user_id = :user_id;";

            $statement = $conn->prepare($sql);
            $statement->execute(array( ":user_id" => $_SESSION["user_id"]));
            $resultArray = array_merge($resultArray, $statement->fetchAll(PDO::FETCH_OBJ));
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return $json;
        }
    }
}
$json = json_encode($resultArray);

echo "$json";

return $json;
?> 