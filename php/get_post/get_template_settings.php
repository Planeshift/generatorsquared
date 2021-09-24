<?php

session_start();

// Can only work if the user is registered
if(!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])){
    $json = json_encode(FALSE);

    echo "$json";

    return $json;
}

//establish the connection
require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

try{
    // get the template settings for this template and this user
    $sql =  "SELECT template_settings.data as data
    FROM    template_settings
    WHERE   template_settings.name = :template_settings_name 
    AND     template_settings.FK_template_id = :templateID 
    AND     template_settings.FK_user_id = :userID;";

    $statement = $conn->prepare($sql);
    $statement->execute(array(  ":template_settings_name" => $_GET["template_settings_name"],
                                ":templateID" => $_GET["template_ID"],
                                ":userID" => $_SESSION["user_id"]));
    $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
}
catch(PDOException $e){
    $json = json_encode($e->getMessage());

    echo "$json";

    return $json;
}
$json = $resultArray[0]->data;
echo "$json";
return $json;

?> 