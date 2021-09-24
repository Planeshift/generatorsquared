<?php 

// Include users stuff
require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

// Include the back-end stuff for creating an account
require_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/get_post/post_create_account.php";

// Restrict this to guests only
restrict_to_guests();
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
        <!-- Add the header -->
        <?php include $_SERVER["DOCUMENT_ROOT"]."/generateur/pages/header.php"?>

        <form id="create_account" action="create_account.php" method="POST">
            <div class="wrapper_form">
                <div class="wrapper_input_warning">
                    <label for="create_username"><b>Username</b></label>
                    <input class="input_create_account" type="text" placeholder="Enter Username" name="create_username" id="create_username" required>
                    <div id="warning_invalid_username" hidden>Username must be 3 to 15 characters long, and characters may only be from the latin alphabet and/or arabic numerals.</div>
                    <div id="warning_taken_username" hidden>This username already exists. Try another one!</div>
                </div>

                <div class="wrapper_input_warning">
                    <label for="create_passsword_1"><b>Password</b></label>
                    <input class="input_create_account" type="password" placeholder="Enter Password" name="create_password_1" id="create_password_1" minlength="8" maxlength="128" required>

                    <label for="create_passsword_2"><b>Password²</b></label>
                    <input class="input_create_account" type="password" placeholder="Enter Password" name="create_password_2" id="create_password_2" minlength="8" maxlength="128" required>
                    <div id="warning_different_passwords" hidden>The two passwords don't match.</div>
                    <div id="warning_invalid_password" hidden>This password is not secure enough: it must be at least 8 characters long.</div>
                </div>

                <div class="wrapper_input_warning">
                    <label for="create_email"><b>Email</b></label>
                    <input class="input_create_account" type="email" placeholder="example@domain.com" name="create_email" id="create_email" required>
                    <div id="warning_invalid_email" hidden>This is not recognized as a valid email adress.</div>
                    <div id="warning_taken_email" hidden>This email adress seems to be used already.</div>
                </div>

                <button id="button_submit" type="submit" disabled>Submit</button>
            </div>
        </form>


    </div>
    <script src="/generateur/js/common/XMLHttpRequest.js"></script>
    <script src="/generateur/js/account/create_account.js"></script>
</body>
</html>