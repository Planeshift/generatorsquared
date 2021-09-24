<?php 
// Include users stuff
    include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

// Check if the user is logged. If not, TO THE LOGIN PAGE WITH YOU.
    if(!isset($_SESSION["username"])){
        header("Location: ./login_account.php");
    }

// Include the back-end stuff for changing the password
    include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/get_post/post_change_password.php";

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
        <form id="change_password" action="change_password.php" method="POST">
            <div class="wrapper_form">

                <?php 
                if(!empty($_SESSION["wrong_password"])){
                    unset($_SESSION["wrong_password"]);
                    
                    echo "<div class=\"div_form_result_message\">Wrong password.</div>";
                }

                if(!empty($_SESSION["password_changed"])){
                    // We only want to show the message once, therefore we unset the variable
                    unset($_SESSION["password_changed"]);

                    // TODO: Style this
                    echo "<div class=\"div_form_result_message\">Password changed!</div>";
                }
                ?>

                <label for="current_password"><b>Enter your current password:</b></label>
                <input type="password" placeholder="Enter Password" name="current_password" id="current_password" required>

                <div class="wrapper_input_warning">
                    <label for="new_password1"><b>Enter a new password:</b></label>
                    <input class="input_create_account" type="password" placeholder="Enter Password" name="new_password1" id="new_password1" minlength="8" maxlength="128" required>

                    <label for="new_password2"><b>Enter it again:</b></label>
                    <input class="input_create_account" type="password" placeholder="Enter Password" name="new_password2" id="new_password2" minlength="8" maxlength="128" required>
                    <div id="warning_different_passwords" hidden>The two passwords don't match.</div>
                    <div id="warning_invalid_password" hidden>This password is not secure enough: it must be at least 8 characters long.</div>
                </div>

                <button id="button_submit" type="submit" disabled>Change password</button>
            </div>
        </form>
    </div>
    
    <script src="/generateur/js/common/math.js"></script>
    <script src="/generateur/js/common/tools.js"></script>
    <script src="/generateur/js/common/XMLHttpRequest.js"></script>
    <script src="/generateur/js/account/change_password.js"></script>

</body>
</html>