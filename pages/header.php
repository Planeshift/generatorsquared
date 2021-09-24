<?php
// Include users stuff
include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

?>


<!-- 

    Tried a logout panel in the top right. Did not work out.
    <div id="div_logout">
        <?php 
        /*
            $session_username = isset($_SESSION["username"]) ? $_SESSION["username"] : "Guest";
        ?>
        <span>Welcome <?php echo "<span class=\"span_username\">".$session_username."</span>" ?></span>
        <?php 
            if(isset($_SESSION["username"])){
                echo "<span><a href=\"/generateur/php/logout.php\">Log out</a></span>";
            } */
        ?>
</div> 

-->

<header id="header_menu">
    <nav id="nav_menu">
        <a href="/generateur/pages/about.php" class="">About</a>
        <a id="a_nav_menu_generator" href="/generateur/pages/index.php" class="">GENERATOR²</a>
        <a href="/generateur/pages/account/account.php" class="">Account</a>
    </nav>
</header>
