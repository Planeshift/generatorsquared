<?php
// Connect to a mySQL db

$server_name = "generapgengen.mysql.db";
$db_name = "generapgengen";
$db_charset = "utf8"; // json only works with utf8 charsets! never forget that.

$dsn = "mysql:host=".$server_name.";dbname=".$db_name.";charset=".$db_charset;

$db_username = "generapgengen";
$db_password = "1motdepasseSQL";

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