/* INCLUDES */

/*
Front-end to check if the user is doing everything correctly.
Back-end does another check because people can always bypass the front-end.
*/

var email_ok = false;

// Event listeners

// We grab the input for the email
var inputEmail = document.getElementById("new_email");

// We check the email
inputEmail.addEventListener("focusout", checkEmail);
inputEmail.addEventListener("input", checkEmail);

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
 * Verify if the email is already taken.
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
    email_ok ? buttonSubmit.disabled = false : buttonSubmit.disabled = true; 
}