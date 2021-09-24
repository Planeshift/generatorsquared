<?php 
// Include users stuff
    include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

// Check if the user is logged. If not, TO THE LOGIN PAGE WITH YOU.
    if(!isset($_SESSION["username"])){
        header("Location: ./login_account.php");
    }
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Generator²</title>
    <link rel="stylesheet" href="/generateur/css/normalize.css">
    <link rel="stylesheet" href="/generateur/css/common.css">
    <link rel="stylesheet" href="/generateur/css/account.css">
</head>
<body>
    <div id="div_content">
        <?php include $_SERVER["DOCUMENT_ROOT"]."/generateur/pages/header.php"?>
        <div id="div_main_content_wrapper">
            <div id="div_welcome_user">
                <span id="span_welcome_user">
                    Welcome <?php echo "<span id=\"span_username\">".$_SESSION['username']."</span>" ?>
                </span>
            </div>

            <div id="div_account_wrapper">
                <div id="div_manage_account_title">Manage your account</div>
                <div id="div_manage_account_wrapper">
                    <div><a href="/generateur/pages/account/change_password.php">Change your password</a></div>
                    <div><a href="/generateur/pages/account/change_email.php">Change your e-mail</a></div>
                    <div><a href="/generateur/php/logout.php">Log out</a></div>
                </div>

                <div id="div_manage_account_templates_and_settings_title">Manage your templates and template settings</div>
                <div id="div_manage_account_templates_and_settings_wrapper">
                    <div id="div_account_templates_list_wrapper">
                        <div id="div_manage_account_templates_title">Templates</div>
                        <div id="div_account_templates_list">
                        </div>
                    </div>
                    <div id="div_account_template_settings_list_wrapper">
                        <div id="div_account_template_settings_title">Settings</div>
                        <div id="div_account_template_settings_list">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    var sessionUsername = "<?php if(isset($_SESSION["username"])){
                                    echo($_SESSION["username"]);
                                }else{
                                    echo("");
                                }?>" ;
    
    </script>
    <script src="/generateur/js/common/math.js"></script>
    <script src="/generateur/js/common/tools.js"></script>
    <script src="/generateur/js/common/XMLHttpRequest.js"></script>
    <script src="/generateur/js/account/account.js"></script>
</body>
</html>