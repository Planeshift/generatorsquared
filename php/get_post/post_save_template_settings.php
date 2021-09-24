<?php

session_start();

// Can only work if the user is registered
if(!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])){
    $json = json_encode("unregistered_user");

    echo "$json";

    return $json;
}

if( !empty($_POST) 
    && isset($_POST["template_settings_name"])
    && isset($_POST["template_settings"]) 
    && isset($_POST["template_ID"]) 
    && isset($_POST["isForceSave"]) ){

    $template_settings_name = filter_var(trim(strval($_POST["template_settings_name"])), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);

    // Cut the name to 100 characters, which is the max in the DB

    // TODO: Probably a file with all those SQL limitations (and an automated way to get them)
    $template_settings_name = substr($template_settings_name, 0, 100);

    //establish the connection
    require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

    if($_POST["isForceSave"] === true || $_POST["isForceSave"] === "true"){

        try{
            // Force a save
            $sql = "INSERT INTO template_settings
                    SET template_settings.name                  =   :name,
                        template_settings.data                  =   :data,
                        template_settings.FK_template_id        =   :templateID,
                        template_settings.FK_user_id            =   :userID
                    ON DUPLICATE KEY UPDATE 
                        template_settings.data                  =   :data_update;";
            
            $statement = $conn->prepare($sql);
            $statement->execute(array(
                ":name" => $template_settings_name,
                ":data" => $_POST["template_settings"],
                ":templateID" => $_POST["template_ID"],
                ":userID" => $_SESSION["user_id"],
                ":data_update" => $_POST["template_settings"]));
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return;
        }

        $json = json_encode(true);

        echo "$json";

        return $json;
    }else{
        
        // Check if the name is in the database
        try{
            $sql =  "SELECT template_settings.name as name
                    FROM    template_settings
                    WHERE   template_settings.name = :templateSettingsName
                    AND     template_settings.FK_user_id = :userID
                    AND     template_settings.FK_template_id = :templateID;";

            $statement = $conn->prepare($sql);
            $statement->execute(array(
                ":templateSettingsName" => $_POST["template_settings_name"], 
                ":userID" => $_SESSION["user_id"],
                ":templateID" => $_POST["template_ID"]));
            $resultArray = $statement->fetchAll();
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return $json;
        }

        if(isset($resultArray[0])){
            $json = json_encode("name_taken");
            
            echo "$json";

            return $json;
        }

        try{
        $sql = "INSERT INTO template_settings
                SET     template_settings.name                  =   :name,
                        template_settings.data                  =   :data,
                        template_settings.FK_template_id        =   :templateID,
                        template_settings.FK_user_id            =   :userID;";

        $statement = $conn->prepare($sql);
        $statement->execute(array(
                                    ":name" => $_POST["template_settings_name"],
                                    ":data" => $_POST["template_settings"],
                                    ":templateID" => $_POST["template_ID"],
                                    ":userID" => $_SESSION["user_id"]));
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
}
?> 