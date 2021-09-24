// Code to make (some) XMLhttprequests without repeating the same code all over again

// VARIABLES

// An assossiative array containing all httpresquests made so far with this function.
// This is useful for aborting some calls, for example when a user changes its mind before the request is done: we don't want the calls to mess up with eachother, so we just keep the latest one and abort the previous call made of the same kind.

var arrayHTTPRequests = {};

/**
 * This function makes some XMLHttpRrequest for us.
 * 
 * @param {string} HTTPRequestType This parameter allows storage of the subsequent HTTPRequest into the global variable arrayHTTPRequests at the key "HTTPRequestType". This allows us to abort the previous request if another is fired before the first is done.
 * @param {string} page The PHP page that we're trying to accesse in AJAX. Do not add parameters here.
 * @param {*} keys The keys in the $_POST or $_GET for our PHP page. For example, in "get_template.php?id=1", the key is "id". Multiple keys must be stored in an array. Use strings if possible.
 * @param {*} values The values in the $_POST or $_GET for our PHP page. For example, in "get_template.php?id=1", the value is "1". Multiple values must be stored in an array. Use strings if possible.
 * @param {*} method The method used to access the PHP page. Must be "POST" or "GET".
 * @returns {Promise} Returns a Promise with our responseText in resolve or error in reject.
 */

async function makeHTTPRequest(   HTTPRequestType = "", 
                            page = "", 
                            keys = "", 
                            values = "", 
                            method = "GET"){
    
    return new Promise(function(resolve, reject) {
        // Abort the previous request
        // We could check if it was successful first, but there's no reason for now to do so

        var httpRequest = arrayHTTPRequests[HTTPRequestType];

        if(httpRequest){
            httpRequest.abort();
        }

        httpRequest = new XMLHttpRequest();
        if(!httpRequest){
            reject("Error in HTTPRequest: could not proceed with the request.");
        }
        else{
            httpRequest.onreadystatechange = function(){
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        resolve(httpRequest.responseText);
                    }
                }
            }
        }
        
        // We take keys and values and turn that into a string to be added to our page

        // Start with an empty string
        var stringKeysAndValue = "";

        // Are they both arrays?
        if(Array.isArray(keys) && Array.isArray(values)){
            // Are they the same length and not empty ?
            if(keys.length == values.length && keys.length > 0){

                // They're both arrays of the same length and are not empty, so we can add the first item of each to our string.
                // I don't know if String() is really useful there, given the operation, but better safe than sorry.

                stringKeysAndValue = String(keys[0])+"="+String(values[0]);

                if (keys.length > 1){
                    for(var i = 1; i < keys.length; i++){
                        stringKeysAndValue += "&"+String(keys[i])+"="+String(values[i]);
                    }
                }
            } else {
                reject("Error in HTTPRequest: Keys and values don't seem to match in length or are missing.")
            }
        } else if(!Array.isArray(keys) && !Array.isArray(values)){
            if(!(keys == "" && values == "")){
                stringKeysAndValue = String(keys)+"="+String(values);
            }
        } else{
            reject("Error in HTTPRequest: Could not proceed with those keys and values.")
        }

        if(method == "POST"){
            httpRequest.open(method, page);
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            httpRequest.send(stringKeysAndValue);
        } else if(method == "GET"){
            if(stringKeysAndValue != ""){
                page += "?"+stringKeysAndValue;
            }
            httpRequest.open(method, page);
            httpRequest.send();
        } else{
            reject("Error in HTTPRequest: invalid method");
        }
    });
}