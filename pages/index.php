<?php
// Include users stuff
include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

?>

<!doctype html>

<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Generator²</title>
    <link rel="stylesheet" href="/generateur/css/normalize.css">
    <link rel="stylesheet" href="/generateur/css/common.css">
    <link rel="stylesheet" href="/generateur/css/generator_editor.css">
</head>
<body>
    <div id="div_content">
        <?php include $_SERVER["DOCUMENT_ROOT"]."/generateur/pages/header.php"?>
    </div>

    <script>
        var sessionUsername = "<?php if(isset($_SESSION["username"])){
                                        echo($_SESSION["username"]);
                                    }else{
                                        echo("");
                                    }?>" ;
        <?php 
            // Alert when logging out
            if(isset($_SESSION["log_out"])){
                unset($_SESSION["log_out"]);
                session_destroy(); 
        ?>
                alert("Log out succesful!"); 
        <?php
            }
        ?>
    </script>
    <script src="/generateur/js/common/math.js"></script>
    <script src="/generateur/js/common/tools.js"></script>
    <script src="/generateur/js/common/XMLHttpRequest.js"></script>
    <script src="/generateur/js/generator/generator.js"></script>
    <script src="/generateur/js/generator/editor.js"></script>
    <script src="/generateur/js/generator/init.js"></script>
</body>
</html>