<?php
// Check if we have some data to process

if(!empty($_POST)){
    // SANITIZE DATA

    // We check if $_POST["create_username"] is there. If not, it's forced to "" (which will throw an error later and stop the account creation.)
    $username = isset($_POST["create_username"]) ? $_POST["create_username"] : "";
    $username = filter_var(trim(strval($username)), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);

    // We don't sanitize passwords (apart from forcing a conversion to strings), because we'll hash them and send them with prepared statements anyway and that's their only use
    $password = isset($_POST["create_password_1"]) ? $_POST["create_password_1"] : "";
    $password_check = isset($_POST["create_password_1"]) ? $_POST["create_password_2"] : "";

    // Same as earlier with $username.
    $email = isset($_POST["create_email"]) ? $_POST["create_email"] : "";
    $email = filter_var(trim(strval($email)),FILTER_SANITIZE_EMAIL);

    // Check the username (3 to 15 characters, any latin character)
    if(!preg_match("/^[a-zA-Z0-9]{3,15}$/", $username)){
        error_log("Error: username incorrect");
        return;
    }

    // Check the character length (not the byte length like strlen) of the password
    if(mb_strlen($password) < 8){
        error_log("Error: password too short");
        return;
    }

    // Check if both passwords are identical
    if($password != $password_check){
        error_log("Error: passwords different");
        return;
    }

    // Chech if the email looks like a common email
    if(!preg_match("/\S+@\S+\.\S+/", $email)){
        error_log("Error: not an email (probably)");
        return;
    }

    // Connect to the database, we need it for what follows
    require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

    // Check if username and email are taken already

    // Same code as post_check_username_email_taken. Should probably consolidate the two.
    // TODO: Consolidate the two.

    try{
        //SQL time
        $sql = "SELECT username
                FROM users
                WHERE username = :user;";
        
        $statement = $conn->prepare($sql);
        $statement->execute(array(":user"=>$username));
        $resultArray = $statement->fetchAll();
    }
    catch(PDOException $e){
        $json = json_encode($e->getMessage());

        echo "$json";

        return $json;
    }

    // If there's any result, the username is already taken
    if(isset($resultArray[0]))
        return "Error: username taken already";

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
    if(isset($resultArray[0]))
        return "Error: email taken already";
    
    // All checks are done. Time to hash the password before user creation.

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // USER CREATION

    try{
    // SQL TIME³
    $sql = "INSERT INTO users
            SET     users.username          =   :user,
                    users.password_hash     =   :passwordhash,
                    users.email             =   :email;";
    
    $statement = $conn->prepare($sql);
    $statement->execute(array(  ":user"             =>  $username,
                                ":passwordhash"     =>  $password_hash,
                                ":email"            =>  $email));
    }
    catch(PDOException $e){
        $json = json_encode($e->getMessage());

        echo "$json";

        return $json;
    }
    // Account created

    session_start();
    $_SESSION["account_created"] = true;

    header("Location: ./login_account.php");
}
?>