<?php

// Check that we have some data to process
if(!empty($_POST)){

    // Check the user_id (should already have been checked but just in case)
    if(!isset($_SESSION["user_id"])){
        error_log("Error: no user_id found");
        return;
    }

    // SANITIZE DATA

    $email = isset($_POST["new_email"]) ? $_POST["new_email"] : "";
    $email = filter_var(trim(strval($email)),FILTER_SANITIZE_EMAIL);

    $password = isset($_POST["password"]) ? $_POST["password"] : "";

    // Chech if the email looks like a common email
    if(!preg_match("/\S+@\S+\.\S+/", $email)){
        error_log("Error: not an email (probably)");
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

    if(!password_verify($password, $resultArray[0]["password_hash"])){
        error_log("Error: wrong password");
        $_SESSION["wrong_password"] = true;
        return "Wrong password";
    }

    try{
        //SQL TIME²
        $sql = "SELECT email
                FROM users
                WHERE email = :email;";

        $statement = $conn->prepare($sql);
        $statement->execute(array(":email"=>$email));
        $resultArray = $statement->fetchAll();
    }
    catch(PDOException $e){
        $json = json_encode($e->getMessage());

        echo "$json";

        return $json;
    }

    // If there's any result, the email is already taken
    if(isset($resultArray[0])){
        $_SESSION["email_taken"] = true;
        error_log("Error: email taken already");
        return "Error: email taken already";
    }

    try{
    // SQL TIME³
    $sql = "UPDATE  users
            SET     users.email = :email
            WHERE   users.PK_user_id = :user_id;";
    
    $statement = $conn->prepare($sql);
    $statement->execute(array(
                                ":email"                =>      $email,
                                ":user_id"              =>      $_SESSION["user_id"]
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