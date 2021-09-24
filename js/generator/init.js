// OTHER JS FILES REQUIRED

/* 
Include each of these files in an individual script tag, in order, before including this file in its own script tag.

js/common/math.js
js/common/tools.js
js/common/XMLHttpRequest.js

*/

// INITIALISATION

/* This is the app booting up. Whenever you load the homepage, this is what manipulates the whole generator and sets it up.

Rather than using PHP to preload the page with the default template, we load the page THEN use some AJAX to ask for the template. Why? Mainly because I truly hate integrating PHP into my code. I find it messy and hard to read.

But there's also two others reasons: closely related to the previous one, it helps to separate languages as much as possible, because if in the future you want to switch one of them, your back-end for example, you can do so without having to retrofit your whole code. All I have to do here is switch get_template.php (and others ajax calls) to something else and voilà. The other reason is a bit more tenuous, but mostly, it helps that setting up the default template is the same as setting up every other template, more or less.
*/


// GLOBAL VARIABLES

// User stuff

// Self-explanatory: we check if the user is registered (using an outside variable, sessionUsername, called in the mainpage with PHP) and store the result

var isUserRegistered = !(sessionUsername == undefined || sessionUsername == "");

// Whenever the content is loaded, we launch the initialization

/* Note on DOM ContentLoaded: Although DOMContentLoaded does not work with IE8 and below, they represent roughly 0.04% of the market share, which is mostly insignificant.

If needed, adding support for IE8 is not unfeasible, but not the priority right now.  */

// Generator stuff

// loadedTemplates: An array containing all the templates that the user requested so far. This increases the memory usage but reduces server requests. A trade-off that may or may not be worth it. Who knows.

// defaultTemplate : refers to loadedTemplates[0], which should ALWAYS be the default template.

// currentTemplates: An array containing all the templates, from left to right, that the user has currently loaded. 

// templateList: The list of all the templates this user may access.

var loadedTemplates = [];
var defaultTemplate;
var currentTemplates = [];
var templateList;


// Global listener for our Promises

document.addEventListener('unhandledrejection', function(event) {
    console.log(event.promise);
    console.log(event.reason);
  });


document.addEventListener("DOMContentLoaded", initialize);

// Global listener for our modals

// Adapted from: https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700 

document.addEventListener('keydown', function(e) {
    if(isModalActive){
        let isTabPressed = e.key === 'Tab';
    
        if (!isTabPressed) {
        return;
        }
    
        if (e.shiftKey) { // if shift key pressed for shift + tab combination
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus(); // add focus for the last focusable element
                e.preventDefault();
            }
        } else { // if tab key is pressed
            if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                firstFocusableElement.focus(); // add focus for the first focusable element
                e.preventDefault();
            }
        }
    }
  });

  
/**
 * The first function called by the application, this sets up the generator and the editor.
 */

async function initialize() {

    // GLOBAL VARIABLES

    // Set up our global variables
    templateList = await getTemplateList();
    loadedTemplates[0] = await getTemplate(1);
    defaultTemplate = loadedTemplates[0];

    // If the user is registered, we set up additional variables
    if(isUserRegistered){
        categoryTypesList = await getCategoryTypesList();
    }

    // Add the content of our app (is it an app? I guess it is)
    addGlobalApp();

    // Activate the modals and load the basic stuff
    activateModal();
}


/**
 * Add the backbone of the app, ie. the top controls, the main box containing everything else, and then add the generator and the editor.
 */

function addGlobalApp(){

    // Identify our global container
    var divContent = document.getElementById("div_content");

    // Set up the controls

    // Container for the controls
    var divWrapperTabs = document.createElement("div");
    divWrapperTabs.id = "div_wrapper_tabs";

    // Tabs to switch between generator / editor
    var buttonTabGenerator = document.createElement("button");
    buttonTabGenerator.id = "button_tab_generator";
    buttonTabGenerator.classList.add("button_tab");
    buttonTabGenerator.textContent = "Generator";

    var buttonTabEditor = document.createElement("button");
    buttonTabEditor.id = "button_tab_editor";
    buttonTabEditor.classList.add("button_tab");
    buttonTabEditor.textContent = "Editor";

    // Add the tabs to their container, then the container to the global div
    divWrapperTabs.appendChild(buttonTabGenerator);
    divWrapperTabs.appendChild(buttonTabEditor);
    divContent.appendChild(divWrapperTabs);

    // Add three container: one for the whole app, one for the generator and one for the editor
    var divApp = document.createElement("div");
    divApp.id = "div_app";

    var divGenerator = document.createElement("div");
    divGenerator.id = "div_generator";
    divGenerator.classList.add("div_app_container");

    var divEditor = document.createElement("div");
    divEditor.id = "div_editor";
    divEditor.classList.add("div_app_container");

    // Append them
    divApp.appendChild(divGenerator);
    divApp.appendChild(divEditor);
    divContent.appendChild(divApp);

    // Hide the editor part: by default, only the generator is visible
    divEditor.hidden = true;

    // EVENT LISTENERS

    buttonTabGenerator.addEventListener("click", function(){
        divEditor.hidden = true;
        divGenerator.hidden = false;
    });

    buttonTabEditor.addEventListener("click", function(){
        divGenerator.hidden = true;
        divEditor.hidden = false;
    });

    // Finally, add the content of the generator and the editor
    addGenerator();
    var isEditorSetUp = addEditor();

    // Add a default template to our generator
    addTemplateToGenerator();

    // Load the default template in our editor
    if(isEditorSetUp){
        loadEditorTemplate();
    }
}