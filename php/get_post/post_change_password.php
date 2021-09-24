<?php

// Check that we have some data to process
if(!empty($_POST)){

    // Check the user_id (should already have been checked but just in case)
    if(!isset($_SESSION["user_id"])){
        error_log("Error: no user_id found");
        return;
    }

    $current_password = isset($_POST["current_password"]) ? $_POST["current_password"] : "";

    $password = isset($_POST["new_password1"]) ? $_POST["new_password1"] : "";
    $password_check = isset($_POST["new_password2"]) ? $_POST["new_password2"] : "";

    // Check the character length (not the byte length like strlen) of the password
    if(mb_strlen($password) < 8){
        error_log("Error: password too short");
        return;
    }

    // Check that both passwords are identical
    if($password != $password_check){
        error_log("Error: passwords different");
        return;
    }

    // Establish the connection to the database
    require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

    try{
        // SQL TIME
        $sql = "SELECT  users.PK_user_id    as  user_id,
                        users.username      as  username,
                        users.password_hash as  password_hash
                FROM    users
                WHERE   users.PK_user_id = :user_id;";

        $statement = $conn->prepare($sql);
        $statement->execute(array(
                                    ":user_id"    =>      $_SESSION["user_id"]
                                ));
        $resultArray = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        $json = json_encode($e->getMessage());

        echo "$json";

        return $json;
    }

    if(!isset($resultArray[0])){
        error_log("Error: could not find user");
        return "Can't find user";
    }

    if(!password_verify($current_password, $resultArray[0]["password_hash"])){
        error_log("Error: wrong password");
        $_SESSION["wrong_password"] = true;
        return "Wrong password";
    }

    // Hash the password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    try{
        // SQL TIME
        $sql = "UPDATE  users
                SET     users.password_hash     =   :password_hash
                WHERE   users.PK_user_id        =   :user_id;";
        
        $statement = $conn->prepare($sql);
        $statement->execute(array(
                                    ":password_hash"            =>      $password_hash,
                                    ":user_id"                  =>      $_SESSION["user_id"]
                                ));
    }
    catch(PDOException $e){
        $json = json_encode($e->getMessage());

        echo "$json";

        return $json;
    }

    $_SESSION["password_changed"] = true;
}

?>