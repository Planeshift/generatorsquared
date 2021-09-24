<?php
include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

if(!isset($_SESSION["username"])){
    header("Location: ../pages/index.php");
}

session_destroy();

session_start();
$_SESSION["log_out"] = true;

header("Location: ../pages/index.php");

?>