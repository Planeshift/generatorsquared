<?php
// Some simple tools (well, one) that I found myself needing

// Sanitizer

/**
 * A simple sanitizer function, to sanitize user inputs.
 */

function sanitizeInput($input, $type = "string", $max = NULL, $min = NULL, $padding = "_"){

    
    switch($type){

        case "string":
            if(!is_string($input)){
                $input = strval($input);
            }
            
            if($min && strlen($input) < $min){
                $input = str_pad($input, $min, $padding);
            }

            if($max && strlen($input) > $max){
                $input = mb_substr($input, 0, $max);
            }

            break;

        case "integer":
            if(!is_int($input)){
                $input = intval($input);
            }

            if($min !== NULL && $input < $min){
                $input = $min;
            }

            if($max !== NULL && $input > $max){
                $input = $max;
            }

            break;

        case "float":
            if(!is_float($input)){
                $input = floatval($input);
            }

            if($min !== NULL && $input < $min){
                $input = $min;
            }

          if($max !== NULL && $input > $max){
                $input = $max;
            }
            break;

        default:
            break;
    }

    return $input;
}
