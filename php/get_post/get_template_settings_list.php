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
    $sql =  "SELECT template_settings.name as name
    FROM    template_settings
    WHERE   template_settings.FK_template_id = :templateID
    AND     template_settings.FK_user_id = :userID;";

    $statement = $conn->prepare($sql);
    $statement->execute(array(":templateID" => $_GET["templateID"], ":userID" => $_SESSION["user_id"]));
    $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);

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