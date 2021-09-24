<?php

// Include users stuff
include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

// Include the back-end stuff for logging in
include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/get_post/post_login_account.php";

// Restrict this to guests only
restrict_to_guests();

?>

<!doctype html>

<html lang="en">
<head>
    <meta charset="utf-8">

    <title>Connect</title>
    <meta name="description" content="">
    <link rel="stylesheet" href="/generateur/css/normalize.css">
    <link rel="stylesheet" href="/generateur/css/common.css">
    <link rel="stylesheet" href="/generateur/css/login_create_account.css">
</head>
<body>
    <div id="content">
        <?php 

        // Include the navbar
        include $_SERVER["DOCUMENT_ROOT"]."/generateur/pages/header.php"
        
        ?>

        <form id="login_form" action="login_account.php" method="POST">
            <div class="wrapper_form">
                <?php 
                if(isset($_SESSION["no_user"])){
                    unset($_SESSION["no_user"]);

                    echo "<div class=\"div_form_result_message\">User not found.</div>";
                }

                if(isset($_SESSION["wrong_password"])){
                    unset($_SESSION["wrong_password"]);
                    
                    echo "<div class=\"div_form_result_message\">Wrong password.</div>";
                }

                if(!empty($_SESSION["account_created"])){
                    // We only want to show the message once, therefore we unset the variable
                    unset($_SESSION["account_created"]);

                    // We add a little thank you, so people know they have created a new account
                    echo "<div class=\"div_form_result_message\">Thank you for creating a new account! You can login already.</div>";
                }
                ?>
                <label for="username"><b>Username</b></label>
                <input type="text" placeholder="Enter Username" name="username" id="username" required>

                <label for="password"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="password" id="password" required>

                <button id="button_submit" type="submit">Login</button>
            </div>
        </form>

        <div id="div_create_account">
            <p>Don't have an account?</br> You can always create one!</p>
            <a id="a_create_account" href="/generateur/pages/account/create_account.php">Create an account</a>
        </div>
    </div>
<script></script>
</body>
</html>