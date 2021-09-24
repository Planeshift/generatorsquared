<?php 
// Include users stuff
    include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

// Check if the user is logged. If not, TO THE LOGIN PAGE WITH YOU.
    if(!isset($_SESSION["username"])){
        header("Location: ./login_account.php");
    }

// Include the back-end stuff for changing the password
    include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/get_post/post_change_email.php";

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Generator²</title>
    <link rel="stylesheet" href="/generateur/css/normalize.css">
    <link rel="stylesheet" href="/generateur/css/common.css">
    <link rel="stylesheet" href="/generateur/css/login_create_account.css">
</head>
<body>
    <div id="content">
        <?php include $_SERVER["DOCUMENT_ROOT"]."/generateur/pages/header.php"?>

        <form id="change_email" action="change_email.php" method="POST">
            <div class="wrapper_form">
            <?php 
            if(!empty($_SESSION["wrong_password"])){
                unset($_SESSION["wrong_password"]);
                echo "<div class=\"div_form_result_message\">Wrong password.</div>";
            }

            if(!empty($_SESSION["email_taken"])){
                unset($_SESSION["email_taken"]);
                echo "<div class=\"div_form_result_message\">Email already taken, or it's the same as the previous one.</div>";
            }

            if(!empty($_SESSION["email_changed"])){
                unset($_SESSION["email_changed"]);
                echo "<div class=\"div_form_result_message\">Email changed!</div>";
            }


            // Get the previous email

            // Establish the connection to the database
            require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

            $sql = "SELECT users.email as email
                    FROM users 
                    WHERE users.PK_user_id = :user_id;";

            $statement = $conn->prepare($sql);
            $statement->execute(array(
                                        ":user_id"   =>     $_SESSION["user_id"]
            ));
            $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);

            if($resultArray[0]){
                echo "<div class=\"div_form_result_message\">Your current email is: ".$resultArray[0]->email."</div>";
            }

            ?>
                <div class="wrapper_input_warning">
                    <label for="new_email"><b>New email</b></label>
                    <input class="input_create_account" type="email" placeholder="example@domain.com" name="new_email" id="new_email" 
                    <?php if($resultArray[0]){echo "value=".$resultArray[0]->email;} ?> 
                    required>
                    <div id="warning_invalid_email" hidden>This is not recognized as a valid email adress.</div>
                    <div id="warning_taken_email" hidden>This email adress seems to be used already.</div>
                </div>

                <label for="password"><b>Password</b></label>
                <input class="input_create_account" type="password" placeholder="Enter Password" name="password" id="password" required>

                <button id="button_submit" type="submit" disabled>Change email</button>
            </div>
        </form>
    </div>
    <script src="/generateur/js/common/math.js"></script>
    <script src="/generateur/js/common/tools.js"></script>
    <script src="/generateur/js/common/XMLHttpRequest.js"></script>
    <script src="/generateur/js/account/change_email.js"></script>
</body>
</html>