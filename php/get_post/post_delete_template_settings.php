<?php

session_start();

// Can only work if the user is registered
if(!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])){
    $json = json_encode("unregistered_user");

    echo "$json";

    return $json;
}

if( !empty($_POST) && isset($_POST["name"]) && isset($_POST["template_id"]) ){

    //establish the connection
    require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

    try{
        // Extra prevention: this request cannot remove default template settings (although none exist as of this writing)
        $sql = "DELETE FROM     template_settings
                WHERE   template_settings.name = :name 
                AND     template_settings.FK_user_ID = :user_id 
                AND     template_settings.FK_template_id = :template_id
                AND     template_settings.FK_user_ID <> 0;";
        
        $statement = $conn->prepare($sql);
        $statement->execute(array(
                                    ":name"         =>  $_POST["name"],
                                    ":template_id"  =>  $_POST["template_id"],
                                    ":user_id"      =>  $_SESSION["user_id"]
                                ));
    }
    catch(PDOException $e){
        $json = json_encode($e->getMessage());

        echo "$json";

        return $json;
    }
    $json = json_encode(true);

    echo "$json";

    return $json;
}

$json = json_encode($_POST);

echo "$json";

return $json;
?>