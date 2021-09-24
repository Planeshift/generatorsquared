<?php
// Some basic functions with users

// Start (or get the existing) session
session_start();

/**
 * restrict_to_guests 
 * 
 * Redirects users when they try to access pages restricted to unlogged users (login_account and create account, mainly)
 * 
 * As of now, it's just a simple header with no warning for the user.
 */

function restrict_to_guests(){
    if(isset($_SESSION["username"])){
        header("Refresh: 0; url=/generateur/pages/index.php");
    }
}
?>