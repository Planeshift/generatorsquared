<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

//Check the POST data
if(!empty($_POST["username"])){
    //Sanitize the input

    //Note : Technically we don't need to thanks to our PDO prepare, but it's still good practice. Yes, it'll throw some false positives if someone is trying to be cheeky with their username, but that's also usually who we want to prevent from getting in, so all in all, fair trade.

    $username = filter_var(trim(strval($_POST["username"])),FILTER_SANITIZE_STRING);

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

    //If the query returns any result, then an user has already this username.
    echo isset($resultArray[0]) ? "true" : "false";
}
elseif(!empty($_POST["email"])){

    $email = trim(strval($_POST["email"]));

    try{
        //SQL TIME
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
    //If the query returns any result, then an user has already this email.
    echo isset($resultArray[0]) ? "true" : "false";
}else{
    echo "failure";
}


?>