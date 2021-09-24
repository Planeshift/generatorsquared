<?php

// Must be included, otherwise we kill this
if( count(get_included_files()) == ((version_compare(PHP_VERSION, '5.0.0', '>='))?1:0) )
{
    die();
}

// Connect to a mySQL db
$server_name = "";
$db_name = "";
$db_charset = "utf8"; // This ensures that JSON will work with our app.

$dsn = "mysql:host=".$server_name.";dbname=".$db_name.";charset=".$db_charset;

$db_username = "";
$db_password = "";

$db_options = [
    PDO::ATTR_EMULATE_PREPARES   => false, // turn off emulation mode for "real" prepared statements
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, //turn on errors in the form of exceptions
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //make the default fetch be an associative array
  ];

try{
    $conn = new PDO($dsn, $db_username, $db_password, $db_options);
}
catch(PDOException $e){
    error_log($e->getMessage());
    exit("An error occured while trying to establish the connection with the database.");
}

?>