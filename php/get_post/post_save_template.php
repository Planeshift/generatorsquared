<?php

session_start();

require $_SERVER["DOCUMENT_ROOT"]."/generateur/php/tools.php";

// Can only work if the user is registered
if(!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])){
    $json = json_encode("unregistered_user");

    echo "$json";

    return $json;
}


if( !empty($_POST) && isset($_POST["json_template"]) && isset($_POST["isForceSave"])){

    $template = json_decode($_POST["json_template"]);

    $force_save = $_POST["isForceSave"] === "true";

    if(is_int($template->id)){

        //establish the connection
        require $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

        try{
            $sql =  "SELECT     PK_template_id as id,
                                title as title,
                                FK_user_id as FK_user_id
                    FROM        template 
                    WHERE       PK_template_id = :id;";

            $statement = $conn->prepare($sql);
            $statement->execute(array(":id"=>$template->id));
            $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return $json;
        }

        // Note: this whole code could be shrunk down a bit (in most of the cases, we do the same thing)
        // However, I prefer to leave it like this for now, in case I add things in different cases (ie. admin messages when we end up in cases we should not find, which means the user probably tampered with the JS object or we did some mistakes somewhere)

        if(isset($resultArray[0])){
            $dbTemplate = $resultArray[0];

            if($dbTemplate->FK_user_id != 0){
                if($dbTemplate->FK_user_id == $_SESSION["user_id"]){
                    // This template was made by this user

                    // Save on THIS template (ignore the namecheck)
                    save_template($template, true, false);
                }else{
                    // This template was made by another user, which is strange

                    // TODO: Admin message when this happens

                    // Save to a new template (namecheck)
                    save_template($template, $force_save, true);
                }
            }else{
                // This is a default template

                // Save to a new template (namecheck)
                save_template($template, $force_save, true);
            }
        }else{
            // No template found with this ID, ie. it's not an update but a new template altogether

            // NOTE: Given how the code works right now, this should never happen (no ID is given to templates created in the editor). However, as is tradition, better safe than sorry.

            // Save the new template (namecheck)
            save_template($template, $force_save, true);
        }
    }else{
        // No ID means this is a new template created in the editor (or the user tampered with the ID)

        // In any case:

        // Save the new template (namecheck)
        save_template($template, $force_save, true);
    }

}else{
    $json = json_encode("post_data_error");

    echo "$json";

    return $json;
}

function save_template($input_template, $force_save = false, $is_new_template = false){

    // re-establish the connection
    require $_SERVER["DOCUMENT_ROOT"]."/generateur/php/connect_db.php";

    $db_template_ids = new stdClass();

    $db_template_ids->input_template = $input_template;

    if($is_new_template){

        // Sanitize the title
        $input_template_title = sanitizeInput($input_template->title, "string", 100);

        try{
            // Check if the name is already taken by a template from this user
            $sql = "SELECT  PK_template_id as id,
                            title as title,
                            FK_user_id as FK_user_id
            FROM        template 
            WHERE       title = :title
            AND         FK_user_id = :user_id;";

            $statement = $conn->prepare($sql);
            $statement->execute(array(
                                        ":title"=>$input_template_title,
                                        ":user_id"=>$_SESSION["user_id"]));
            $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return $json;
        }

        if(isset($resultArray[0])){
            if(!$force_save){
                $json = json_encode("name_taken");

                echo "$json";

                return $json;
            }else{
                // Change the input template id to be the one found in the database
                $input_template->id = $resultArray[0]->id;

                return save_template($input_template, $force_save, false);
            }
        }else{
            // No template with this name. We can insert a new template

            // Insert the template
            try{
                $sql = "INSERT INTO template
                        SET     template.title          = :title,
                                template.FK_user_id     = :user_id;";
                
                $statement = $conn->prepare($sql);
                $statement->execute(array(
                                            ":title"    =>  $input_template_title,
                                            ":user_id"  =>  $_SESSION["user_id"]));
            }
            catch(PDOException $e){
                $json = json_encode($e->getMessage());
    
                echo "$json";
    
                return $json;
            }

            $template_id = $conn->lastInsertID();

            $input_category_ids = [];
            $db_category_ids = [];
            $list_order = 0;
            $db_category_sanitized_inputs = [];

            foreach($input_template->categories as $category){

                $list_order++;

                // Sanitize data

                // Note: We could (and should) do more on category_type, but honestly, if it's not a good category_type, it means the user tampered with it directly, so whatever

                
                $category_title             = sanitizeInput($category->title, "string", 75);
                $category_type              = sanitizeInput($category->type, "string", 10);
                $category_number_min        = sanitizeInput($category->number_min, "float", 2147483647, -2147483648);
                $category_number_max        = sanitizeInput($category->number_max, "float", 2147483647, -2147483648);
                $category_decimals          = sanitizeInput($category->decimals, "integer", 10, 0);
                $category_help              = sanitizeInput($category->help, "string", 65535);

                try{
                    $sql = "INSERT INTO category
                            SET     category.title          =   :title,
                                    category.type           =   :type,
                                    category.number_min     =   :number_min,
                                    category.number_max     =   :number_max,
                                    category.decimals       =   :decimals,
                                    category.help           =   :help,
                                    category.FK_template_ID =   :template_id,
                                    category.list_order     =   :list_order;";
                    
                    $statement = $conn->prepare($sql);
                    $statement->execute(array(
                                                ":title"        =>  $category_title,
                                                ":type"         =>  $category_type,
                                                ":number_min"   =>  $category_number_min,
                                                ":number_max"   =>  $category_number_max,
                                                ":decimals"     =>  $category_decimals,
                                                ":help"         =>  $category_help,
                                                ":template_id"  =>  $template_id,
                                                "list_order"    =>  $list_order));
                }
                catch(PDOException $e){
                    $json = json_encode($e->getMessage());
        
                    echo "$json";
        
                    return $json;
                }
                array_push($input_category_ids, $category->id);
                array_push($db_category_ids, $conn->lastInsertID());
            }

            $db_element_ids = [];
            $db_element_category_ids = [];
            $list_order = 0;

            foreach($input_template->elements as $element){
                $this_category_id = NULL;
                $list_order++;

                for($i = 0, $size = count($input_category_ids); $i < $size; $i++){
                    if($element->category_id == $input_category_ids[$i]){
                        $this_category_id = $db_category_ids[$i];
                        break;
                    }
                }

                if($this_category_id != NULL){

                    // Sanitize the input data
                    $element_title  = sanitizeInput($element->title, "string", 60);
                    $element_help   = sanitizeInput($element->help, "string", 65535);

                    try{
                        $sql = "INSERT INTO element
                                SET     element.title           =   :title,
                                        element.help            =   :help,
                                        element.FK_category_id  =   :category_id,
                                        element.list_order      =   :list_order;";
                        
                        $statement = $conn->prepare($sql);
                        $statement->execute(array(
                                                    ":title"        =>  $element_title,
                                                    ":help"         =>  $element_help,
                                                    ":category_id"  =>  $this_category_id,
                                                    ":list_order"   =>  $list_order));
                    }
                    catch(PDOException $e){
                        $json = json_encode($e->getMessage());
            
                        echo "$json";
            
                        return $json;
                    }

                    array_push($db_element_ids, $conn->lastInsertID());
                    array_push($db_element_category_ids, $this_category_id);
                }else{
                    array_push($db_element_ids, "Error - could not find category id - $element->id");
                    array_push($db_element_category_ids, "Error - could not find category id - $element->category_id");
                }
            }
        }

        // Return the IDs to the user so the history templates can be updated
        $db_template_ids->template_id = $template_id;
        $db_template_ids->category_ids = $db_category_ids;
        $db_template_ids->element_ids = $db_element_ids;
        $db_template_ids->element_category_ids = $db_element_category_ids;

        $json = json_encode($db_template_ids);

        echo "$json";

        return $json;

    }else{

        // This is not a new template: therefore, we update the existing one (we checked earlier that it was owned by this user)

        // Sanitize the title
        $input_template_title = sanitizeInput($input_template->title, "string", 100);

        try{
            $sql = "UPDATE  template
                    SET     template.title          = :title,
                            template.FK_user_id     = :user_id
                    WHERE   template.PK_template_id = :template_id;";
            
            $statement = $conn->prepare($sql);
            $statement->execute(array(
                                        ":title"        =>  $input_template_title,
                                        ":user_id"      =>  $_SESSION["user_id"],
                                        ":template_id"  =>  $input_template->id));
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return $json;
        }
        $input_category_ids = [];
        $db_category_ids = [];

        $list_order = 0;
        // For each category, we must do a series of check before doing anything


        foreach($input_template->categories as $category){
            // The category must follow three conditions to be updated: existence (which could be done with SQL), ownership by this user (can't really be done at the same time), linked to the template (same deal)

            $list_order++;

            // Sanitize the input data
            $category_title             = sanitizeInput($category->title, "string", 75);
            $category_type              = sanitizeInput($category->type, "string", 10);
            $category_number_min        = sanitizeInput($category->number_min, "float", 2147483647, -2147483648);
            $category_number_max        = sanitizeInput($category->number_max, "float", 2147483647, -2147483648);
            $category_decimals          = sanitizeInput($category->decimals, "integer", 10, 0);
            $category_help              = sanitizeInput($category->help, "string", 65535);
            
            // We can't really do a INSERT INTO… ON DUPLICATE KEY UPDATE, we must do some checks ourselves
            try{
                $sql = "SELECT  category.PK_category_id as id
                        FROM    category
                        INNER JOIN template on category.FK_template_id = template.PK_template_id
                        WHERE   category.PK_category_id     = :category_id 
                        AND     template.FK_user_id         = :user_id
                        AND     category.FK_template_id     = :template_id;";
                
                $statement = $conn->prepare($sql);
                $statement->execute(array(
                                            ":category_id"    =>  $category->id,
                                            ":user_id"        =>  $_SESSION["user_id"],
                                            ":template_id"    =>  $input_template->id));

                $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
            }
            catch(PDOException $e){
                $json = json_encode($e->getMessage());
    
                echo "$json";
    
                return $json;
            }

            if(isset($resultArray[0])){

                try{
                    // Category exists, is linked to our template, and this template is owned by this user
                    $sql = "UPDATE  category
                            SET     category.title              = :title,
                                    category.type               = :type,
                                    category.number_min         = :number_min,
                                    category.number_max         = :number_max,
                                    category.decimals           = :decimals,
                                    category.help               = :help,
                                    category.list_order         = :list_order
                            WHERE   category.PK_category_id     = :category_id;";
                    
                    $statement = $conn->prepare($sql);
                    $statement->execute(array(
                                                ":title"        =>  $category_title,
                                                ":type"         =>  $category_type,
                                                ":number_min"   =>  $category_number_min,
                                                ":number_max"   =>  $category_number_max,
                                                ":decimals"     =>  $category_decimals,
                                                ":help"         =>  $category_help,
                                                ":list_order"   =>  $list_order,
                                                ":category_id"  =>  $category->id
                                            ));
                }
                catch(PDOException $e){
                    $json = json_encode($e->getMessage());
        
                    echo "$json";
        
                    return $json;
                }

                array_push($input_category_ids, $category->id);
                array_push($db_category_ids, $category->id);

            }else{

                try{
                    // Create a new category
                    $sql = "INSERT INTO category
                            SET     category.title          =   :title,
                                    category.type           =   :type,
                                    category.number_min     =   :number_min,
                                    category.number_max     =   :number_max,
                                    category.decimals       =   :decimals,
                                    category.help           =   :help,
                                    category.FK_template_ID =   :template_id, 
                                    category.list_order     = :list_order;";
                    
                    $statement = $conn->prepare($sql);
                    $statement->execute(array(
                                                ":title"        =>  $category_title,
                                                ":type"         =>  $category_type,
                                                ":number_min"   =>  $category_number_min,
                                                ":number_max"   =>  $category_number_max,
                                                ":decimals"     =>  $category_decimals,
                                                ":help"         =>  $category_help,
                                                ":template_id"  =>  $input_template->id,
                                                ":list_order"   =>  $list_order
                                            ));
                }
                catch(PDOException $e){
                    $json = json_encode($e->getMessage());
        
                    echo "$json";
        
                    return $json;
                }

                array_push($input_category_ids, $category->id);
                array_push($db_category_ids, $conn->lastInsertID());
            }
        }

        // Similar logic for the elements now

        $db_element_ids = [];
        $db_element_category_ids = [];

        $list_order = 0;

        foreach($input_template->elements as $element){

            // Sanitize the input data
            $element_title  = sanitizeInput($element->title, "string", 60);
            $element_help   = sanitizeInput($element->help, "string", 65535);

            // Try to find this element, again checking for: existence, user ownership, template ownership
            $list_order++;

            try{
                $sql = "SELECT  element.PK_element_id as id,
                                element.FK_category_id as category_id
                        FROM element
                        INNER JOIN category ON element.FK_category_id = category.PK_category_id
                        INNER JOIN template ON category.FK_template_id = template.PK_template_id
                        WHERE   element.PK_element_id       = :element_id 
                        AND     element.FK_category_id      = :category_id
                        AND     category.FK_template_id     = :template_id
                        AND     template.FK_user_id         = :user_id;";
                
                $statement = $conn->prepare($sql);
                $statement->execute(array(
                                            ":element_id"     =>    $element->id,
                                            ":category_id"    =>    $element->category_id,
                                            ":template_id"    =>    $input_template->id,
                                            ":user_id"        =>    $_SESSION["user_id"]
                                        ));
                $resultArray = $statement->fetchAll(PDO::FETCH_OBJ);
            }
            catch(PDOException $e){
                $json = json_encode($e->getMessage());
    
                echo "$json";
    
                return $json;
            }


            if(isset($resultArray[0])){

                try{
                // Element exists, is linked to our template, and this template is owned by this user
                $sql = "UPDATE  element
                        SET     element.title               = :title,
                                element.help                = :help,
                                element.list_order          = :list_order
                        WHERE   element.PK_element_id       = :element_id;";
        
                $statement = $conn->prepare($sql);
                $statement->execute(array(
                                            ":title"        =>  $element_title,
                                            ":help"         =>  $element_help,
                                            ":list_order"   =>  $list_order,
                                            ":element_id"   =>  $element->id
                                        ));
                }
                catch(PDOException $e){
                    $json = json_encode($e->getMessage());
        
                    echo "$json";
        
                    return $json;
                }

                array_push($db_element_ids, $element->id);
                array_push($db_element_category_ids, $resultArray[0]->category_id);

            }else{
                // New element
                $this_category_id = NULL;

                for($j = 0, $size = count($input_category_ids); $j < $size; $j++){
                    if($element->category_id == $input_category_ids[$j]){
                        $this_category_id = $db_category_ids[$j];
                        break;
                    }
                }

                if($this_category_id != NULL){

                    try{
                        $sql = "INSERT INTO element
                                SET     element.title           =   :title,
                                        element.help            =   :help,
                                        element.FK_category_id  =   :category_id,
                                        element.list_order      =   :list_order;";
                        
                        $statement = $conn->prepare($sql);
                        $statement->execute(array(
                                                    ":title"        =>  $element_title,
                                                    ":help"         =>  $element_help,
                                                    ":category_id"  =>  $this_category_id,
                                                    ":list_order"   =>  $list_order
                                                ));
                    }
                    catch(PDOException $e){
                        $json = json_encode($e->getMessage());
            
                        echo "$json";
            
                        return $json;
                    }

                    array_push($db_element_ids, $conn->lastInsertID());
                    array_push($db_element_category_ids, $this_category_id);
                }else{
                    array_push($db_element_ids, "Error - could not find category id - $element->id");
                    array_push($db_element_category_ids, "Error - could not find category id - $element->category_id");
                }

            }
        }
        // DELETION

        // We now delete all unwanted components, starting with elements, then with categories

        // Delete all elements that are linked to this template but were not inserted nor updated

        // NOTE: There are now triggers in the database (whenever a template is deleted, categories are deleted ; and whenever categories are deleted, elements are deleted), but redundancy does not hurt

        try{
            $sql = "DELETE element 
            FROM element
            INNER JOIN category ON element.FK_category_id = category.PK_category_id
            INNER JOIN template ON category.FK_template_id = template.PK_template_id
            WHERE element.FK_category_id = category.PK_category_ID
            AND category.FK_template_id = :template_id";

            if(count($input_template->elements) > 0){
                $sql .= " AND element.PK_element_id NOT IN (".implode(",",$db_element_ids).");";
            }else{
                $sql .= ";";
            }

            $statement = $conn->prepare($sql);
            $statement->execute(array(
                                        ":template_id" => $input_template->id));
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return $json;
        }

        // Now that we have inserted or updated the existing categories, we need to delete the ones that don't exist anymore: those we did not update that are linked to this template

        // That's why we stored every ID as we went.

        try{
            $sql = "DELETE FROM category
            WHERE category.FK_template_id = :template_id";
            
            if(count($input_template->categories) > 0){
                $sql .= " AND category.PK_category_id NOT IN (".implode(",",$db_category_ids).");";
            }else{
                $sql .= ";";
            }

            $statement = $conn->prepare($sql);
            $statement->execute(array(
                            ":template_id" => $input_template->id));
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return $json;
        }

        // We'll also delete all template settings associated to this template. 

        // We could make a "delete all broken template settings, keep the ones that could still work", but right now, let's just delete them all
        // TODO: that.

        try{
            $sql = "DELETE FROM template_settings 
                    WHERE   template_settings.FK_template_id  =   :template_id;";

            // Not checking for ownership because even if it's not theirs, we must delete or it'll break

            $statement = $conn->prepare($sql);
            $statement->execute(array(
                    ":template_id" => $input_template->id));
        }
        catch(PDOException $e){
            $json = json_encode($e->getMessage());

            echo "$json";

            return $json;
        }

        // Return the IDs to the user so the history templates can be updated
        $db_template_ids->template_id = $input_template->id;
        $db_template_ids->category_ids = $db_category_ids;
        $db_template_ids->element_ids = $db_element_ids;
        $db_template_ids->element_category_ids = $db_element_category_ids;

        $json = json_encode($db_template_ids);

        echo "$json";

        return $json;
        
    }
}

?>