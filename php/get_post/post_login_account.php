<?php

// Check that we have some data to process

if(!empty($_POST)){
    // SANITIZE DATA

    // We check if $_POST["create_username"] is there. If not, it's forced to "" (which is not a valid username and not in the database, normally)
    $username = isset($_POST["username"]) ? $_POST["username"] : "";
    $username = filter_var(trim(strval($username)), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);

    // We don't sanitize passwords (apart from forcing a conversion to strings), because we'll hash them and send them with prepared statements anyway and that's their only use
    $password = isset($_POST["password"]) ? $_POST["password"] : "";

    // Establish the connection to the database
    require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

    // TODO: Bruteforce attacks protection?

    try{
        // SQL TIME
        $sql = "SELECT  users.PK_user_id    as  user_id,
                        users.username      as  username,
                        users.password_hash as  password_hash
                FROM    users
                WHERE   username = :user;";
        
        $statement = $conn->prepare($sql);
        $statement->execute(array(":user"=>$username));
        $resultArray = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        $json = json_encode($e->getMessage());

        echo "$json";

        return $json;
    }

    // If there's no result, there's no such user: stop execution and get out
    if(!isset($resultArray[0])){
        $_SESSION["no_user"] = true;
        return "No such user";
    }

    // Check the hash
    if(!password_verify($password, $resultArray[0]["password_hash"])){
        $_SESSION["wrong_password"] = true;
        return "Wrong password";
    }

    // Password is correct: start the session
    session_start();
    $_SESSION["username"] = $username;
    $_SESSION["user_id"] = $resultArray[0]["user_id"];

    // TODO: Remember me cookie

    // Send to the account
    header("Location: ./account.php");
}

?>