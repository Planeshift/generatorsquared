/* INCLUDES */

/*
Front-end to check if the user is doing everything correctly.
Back-end does another check because people can always bypass the front-end.
*/

var username_ok = false;
var password_ok = false;
var psw1_2_ok = false;
var email_ok = false;

// Event listeners

// We grab the input for the username
var inputUsername = document.getElementById("create_username");

// We add two listeners: one on input, one on focusout. This helps smooths the experience for the user.
inputUsername.addEventListener("input", checkUsername);
inputUsername.addEventListener("focusout", checkUsername);

// We grab the inputs for the passwords
var inputPassword1 = document.getElementById("create_password_1");
var inputPassword2 = document.getElementById("create_password_2");

// We don't need to check the second password, given that we check if they're identicals already.

inputPassword1.addEventListener("focusout", checkPassword);
inputPassword1.addEventListener("focusout", checkIdenticalPasswords);
inputPassword2.addEventListener("focusout", checkIdenticalPasswords);
inputPassword1.addEventListener("input", checkPassword);
inputPassword1.addEventListener("input", checkIdenticalPasswords);
inputPassword2.addEventListener("input", checkIdenticalPasswords);

// We grab the input for the email
var inputEmail = document.getElementById("create_email");

// We check the email
inputEmail.addEventListener("focusout", checkEmail);
inputEmail.addEventListener("input", checkEmail);

// CHECK DAT USERNAME

/**
 * Checks if the username is valid.
 * 
 * @param {*} e 
 */

function checkUsername(e){
    // We don't want to fire this when the user is typing the first three letters of their username, unless it's to switch to another input (like their password)

    var isOnFocusOut = e.type === "focusout";
    var username = e.target.value;

    // Reset on bad username
    
    username_ok = false;

    if((isOnFocusOut && username.length<3) || username.length>=3){
        // Define the username validation regular expression
        // Any regular latin character and/or numbers, length between 3 and 15.
        regexUsername = new RegExp("^[a-zA-Z0-9]{3,15}$");

        // Is the username valid according to regex?
        if(regexUsername.test(username)){

            // Reset the warnings
            document.getElementById("warning_invalid_username").hidden = true;
            document.getElementById("warning_taken_username").hidden = true;

            // Check if the username is taken
            // This is an AJAX call, so we setup a promise.
            let check = isUsernameTaken(username);
            check.then(
                function(responseText){
                    if(responseText == "true"){
                        // Set a warning
                        document.getElementById("warning_taken_username").hidden = false;
                    }else{
                        username_ok = true;
                    }
                    checkSubmit();
                },
                function(error){
                    console.log(error);
                });
        }
        else{
            // Set the invalid username warning
            document.getElementById("warning_invalid_username").hidden = false;
            checkSubmit();
        }
        
    }
}

// the httprequest is stored outside the code to abort the previous one, preventing multiple callbacks interfering witch eachother later on
var httpRequestUsername;

// AJAX to check if the username is taken.
// RECYCLE: This needs to be recycled into one big XMLHttpRequest function

/**
 * Checks if the username is already taken.
 * 
 * @param {*} username 
 * @returns {*} True if taken, false otherwise
 */

function isUsernameTaken(username){
    return makeHTTPRequest(     "username", 
                                "/generateur/php/get_post/post_check_username_email_taken.php", 
                                "username", 
                                username, 
                                "POST");
}


// CHECK PASSWORD

// We check if the password responds to our rules (only a length one)

/**
 * Checks if the password is valid.
 * 
 * @param {*} e 
 */

function checkPassword(e){
    var password = e.target.value;

    // Reset warning
    document.getElementById("warning_invalid_password").hidden = true;

    // Reset on bad password
    password_ok = false;

    if(password.length<8 && password.length > 0){
        // Password too short: raise a warning
        if(e.type == "focusout"){
            document.getElementById("warning_invalid_password").hidden = false;
        }
    }
    else{
        password_ok = true;
    }

    checkSubmit();
}

/**
 * Checks if the two passwords are identicals.
 * 
 * @param {*} e 
 */

// We check if the passwords are identicals
function checkIdenticalPasswords(e){

    var password1 = inputPassword1.value;
    var password2 = inputPassword2.value;

    var isIdenticalPasswords = password1 == password2;

    psw1_2_ok = false;
    // If both passwords inputs have at least something in them, we do the check and act on that
    if(password1.length > 0 && password2.length > 0){
        if(isIdenticalPasswords){
            document.getElementById("warning_different_passwords").hidden = true;
            psw1_2_ok = true;
        } else{
            if(e.type == "focusout"){
                document.getElementById("warning_different_passwords").hidden = false;
            }
        }
    }

    // If both passwords are empty, we reset the warning
    // We could let it, but I always personally find it a bit infuriating 
    if(password1.length == 0 && password2.length == 0){
        document.getElementById("warning_different_passwords").hidden = true;
    }

    checkSubmit();
}

// CHECK EMAIL

// Validating email is a nightmare. That's why we all hate it.

// The only way to validate an email is to send mail to it, honestly. No way of knowing beforehand. However, we can still check if the overall look of it is okay, but even that is far from the best. Even the official standard (RFC 5322) gives a definition so broad that some emails that are *perfectly valid* (and probably exist) would crash some applications.

// Rather than doing that, we'll just… use a slightly narrower regular expression that still covers the vast majority of email adresses.

/**
 * Checks if the email is valid.
 * 
 * @param {*} e 
 */

function checkEmail(e){

    var email = e.target.value;

    // Reset the warnings
    document.getElementById("warning_taken_email").hidden = true;
    document.getElementById("warning_invalid_email").hidden = true;
    
    // Reset the email_ok
    email_ok = false;

    // Establish the simplest regex
    var regexEmail = /\S+@\S+\.\S+/;

    if(!regexEmail.test(email) || email.length > 254){
        // The email does not pass the almighty regex

        // We check the event to not put the warning when you start typing an adress
        if(e.type == "focusout" && email.length > 0){
            document.getElementById("warning_invalid_email").hidden = false;
        }
        checkSubmit();
    }else{
        // Check if the email is taken or not
        let check = isEmailTaken(email);
        check.then(
            function(responseText){
                if(responseText == "true"){
                    // Email taken
                    document.getElementById("warning_taken_email").hidden = false;
                } else{
                    email_ok = true;
                }
                checkSubmit();
            },
            function(error){
                console.log(error);
            }
        )
    }
}

var httpRequestEmail;

/**
 * Checks if the email is already taken.
 * 
 * @param {*} email 
 * @returns {*} 
 */

function isEmailTaken(email){
    return makeHTTPRequest( "email", 
                            "/generateur/php/get_post/post_check_username_email_taken.php", 
                            "email", 
                            email, 
                            "POST");
}

/**
 * Check if everything is correct before allowing the user to use the submit button.
 */

function checkSubmit(){
    var buttonSubmit = document.getElementById("button_submit");
    username_ok && password_ok && psw1_2_ok && email_ok ? buttonSubmit.disabled = false : buttonSubmit.disabled = true; 
}