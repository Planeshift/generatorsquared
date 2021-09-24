/* INCLUDES */

/*
Front-end to check if the user is doing everything correctly.
Back-end does another check because people can always bypass the front-end.
*/

var password_ok = false;
var psw1_2_ok = false;

// Event listeners

// We grab the inputs for the passwords
var inputPassword1 = document.getElementById("new_password1");
var inputPassword2 = document.getElementById("new_password2");

// We don't need to check the second password, given that we check if they're identicals already.

inputPassword1.addEventListener("focusout", checkPassword);
inputPassword1.addEventListener("focusout", checkIdenticalPasswords);
inputPassword2.addEventListener("focusout", checkIdenticalPasswords);
inputPassword1.addEventListener("input", checkPassword);
inputPassword1.addEventListener("input", checkIdenticalPasswords);
inputPassword2.addEventListener("input", checkIdenticalPasswords);

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

// We check if the passwords are identicals

/**
 * Checks if the two passwords are identicals.
 * 
 * @param {*} e 
 */

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

/**
 * Check if everything is correct before allowing the user to use the submit button.
 */

function checkSubmit(){
    var buttonSubmit = document.getElementById("button_submit");
    password_ok && psw1_2_ok ? buttonSubmit.disabled = false : buttonSubmit.disabled = true; 
}