/*
A set of general purpose tools.
*/

var fakeCategoryID = -1;
var fakeElementID = -1;

// OBJECT MANIPULATION

/**
 * Creates a deep clone of an object. Shamelessly stolen I mean copied from: https://medium.com/weekly-webtips/deep-clone-with-vanilla-js-5ef16e0b365c by Narek Keryan
 * 
 * 
 * @param {*} entity 
 * @param {*} cache 
 * @returns {*} 
 */

function cloneDeep(entity, cache = new WeakMap) {
    const referenceTypes = ['Array', 'Object', 'Map', 'Set', 'WeakMap', 'WeakSet'];
    const entityType = Object.prototype.toString.call(entity); 
    
    if (!new RegExp(referenceTypes.join('|')).test(entityType)){ 
        return entity;
    }
    
    if (cache.has(entity)){
      return cache.get(entity);
    }
    
    const c = new entity.constructor;
    
    if (entity instanceof Map || entity instanceof WeakMap) {
        entity.forEach((value, key) => c.set(cloneDeep(key), cloneDeep(value)));
    }
    if (entity instanceof Set || entity instanceof WeakSet) {
        entity.forEach((value) => c.add(cloneDeep(value)));
    }
    cache.set(entity, c);
    
    return Object.assign(c, ...Object.keys(entity).map((prop) => ({ [prop]: cloneDeep(entity[prop], cache) })));
  }

/**
 * This creates a deep clone of a template object before emptying its values and returning it.
 * 
 * /!\ ONLY WORKS IF DEFAULTTEMPLATE HAS BEEN SET UP
 * 
 * WHY NOT CREATE A PROPER CLASS? you may ask.
 * 
 * The reason is a bit dumb: I don't really know the structure of the template object. It depends on what I send back with PHP, and if I start messing around with the database, then my whole constructor won't work anymore unless I change it.
 * 
 * There may be (and probably is) an elegant solution that takes the template object we get via our AJAX request and create a proper class from that structure. However, sometimes, dirty code is enough.
 * 
 * TODO: Undirty your code, you fool.
 * 
 * @returns {*} An empty template, hopefully
 */

function createEmptyTemplate(){
    return setEmptyObject(cloneDeep(defaultTemplate));
}

/**
 * Recursively set the values of an object to null or [] (empty array), depending on the property. 
 * 
 * @param {*} input
 * @param {boolean} checkArray True by default. Set the arrays to [] if true, otherwise all the array values will be set to null.
 * @returns {*} An "empty" object, as described earlier.
 */

function setEmptyObject(input, checkArray = true){

    if(input == null){
        return input;
    }

    let keys = Object.keys(input);

    for(let key of keys){
        if(typeof input[key] == "object"){
            if(checkArray && Array.isArray(input[key])){
                input[key] = [];
            }else{
                setEmptyObject(input[key]);
            }
        }
        else{
            input[key] = null;
        }
    }

    return input;
}

/**
 * Creates an empty category object.
 * 
 * @returns {*} An empty category
 */

function createEmptyCategory(){
    return setEmptyObject(cloneDeep(defaultTemplate.categories[0]));
}

/**
 * Sets up an ID that identifies this category as a category created in the Editor and not saved in the database.
 * 
 * @param {Object} category 
 * @returns {*} The updated category
 */

function setFakeCategoryID(category){
    category.id = fakeCategoryID;
    fakeCategoryID--;
    return category;
}

/**
 * Creates an empty element object.
 * 
 * @returns {*} An empty element
 */
function createEmptyElement(){
    return setEmptyObject(cloneDeep(defaultTemplate.elements[0]));
}

/**
 * Sets up an ID that identifies this element as an element created in the Editor and not saved in the database.
 * 
 * @param {Object} element 
 * @returns {*} The updated element
 */

function setFakeElementID(element){
    element.id = fakeElementID;
    fakeElementID--;
    return element;
}

// HTML ELEMENTS

/**
 * Helper function to remove every element from a container.
 * 
 * @param {HTMLElement} wrapper 
 * @returns {*} 
 */

function cleanWrapper(wrapper){
  while(wrapper.firstChild){
    wrapper.firstChild.remove();
  }
  return wrapper;
}

/**
 * Helper function to move an HTMLElement before its previous sibling in a container.
 * 
 * @param {HTMLElement} element 
 * @returns {*} True if the element moved, false otherwise
 */
function HTMLElementMoveUpInContainer(element){

  let container = element.parentNode;

  if(element.previousSibling != null && container != null){

      // Move the element before the previous element
      container.insertBefore(element, element.previousSibling);

      return true;
  }
  return false;
}

/**
* Helper function to move an HTMLElement after its next sibling in a container.
* 
* @param {HTMLElement} element 
* @returns {*} True if the element moved, false otherwise
*/

function HTMLElementMoveDownInContainer(element){
  let nextSibling = element.nextSibling;

  let container = element.parentNode;

  // Is there a next element?
  if(nextSibling && container != null){
      // Does this one has itself another element after it?
      if(nextSibling.nextSibling){
          // If yes, insert it before
          container.insertBefore(element, nextSibling.nextSibling);

          return true;
      }else{
          // If not, it's the end of the list, so we move our element there
          container.appendChild(element);

          return true;
      }
  }

  return false;
}

// MODAL

// Modal stuff

var isModalActive = false;
var focusableElements = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
var focusableContent;
var firstFocusableElement;
var lastFocusableElement;

/**
 * As the name suggests, activates the modals. This is called at the beginning whenever a page uses modal.
 * 
 */

function activateModal(){

    // Create the modals and the overlay
    
    // Overlay
    var divModalOverlay = document.createElement("div");
    divModalOverlay.id = "div_modal_overlay";
    divModalOverlay.classList.add("closed");
    document.body.appendChild(divModalOverlay);

    // Main Modal
    var divMainModal = document.createElement("div");
    divMainModal.id = "div_main_modal";
    divMainModal.classList.add("div_main_modal_default", "closed");
    document.body.appendChild(divMainModal);

        // Title bar

        // Wrapper containing the title of the modal and the button that closes the modal
        var divMainModalTitleWrapper = document.createElement("div");
        divMainModalTitleWrapper.id = "div_main_modal_title_wrapper";
        divMainModalTitleWrapper.classList.add("div_modal_title_wrapper");
        divMainModal.appendChild(divMainModalTitleWrapper);

            // Title
            var divMainModalTitle = document.createElement("div");
            divMainModalTitle.id = "div_main_modal_title";
            divMainModalTitle.classList.add("div_modal_title");
            divMainModalTitleWrapper.appendChild(divMainModalTitle);

            // Button Close
            var buttonCloseMainModal = document.createElement("button");
            buttonCloseMainModal.id = "button_close_main_modal";
            buttonCloseMainModal.classList.add("button_close_modal");
            buttonCloseMainModal.textContent = "X";
            divMainModalTitleWrapper.appendChild(buttonCloseMainModal);

        // Main Modal Content Wrapper
        var divMainModalContentWrapper = document.createElement("div");
        divMainModalContentWrapper.id = "div_main_modal_content_wrapper";
        divMainModalContentWrapper.classList.add("div_modal_content_wrapper");
        divMainModal.appendChild(divMainModalContentWrapper);

        // Main Modal Controls Wrapper
        var divMainModalControlsWrapper = document.createElement("div");
        divMainModalControlsWrapper.id = "div_main_modal_controls_wrapper";
        divMainModalControlsWrapper.classList.add("div_modal_controls_wrapper");
        divMainModal.appendChild(divMainModalControlsWrapper);

    // Secondary Modal
    var divSecondaryModal = document.createElement("div");
    divSecondaryModal.id = "div_secondary_modal";
    divSecondaryModal.classList.add("div_secondary_modal_default", "closed");
    document.body.appendChild(divSecondaryModal)

        // Title bar

        // Wrapper containing the title and the close button
        var divSecondaryModalTitleWrapper = document.createElement("div");
        divSecondaryModalTitleWrapper.id = "div_secondary_modal_title_wrapper";
        divSecondaryModalTitleWrapper.classList.add("div_modal_title_wrapper");
        divSecondaryModal.appendChild(divSecondaryModalTitleWrapper);

            // Title
            var divSecondaryModalTitle = document.createElement("div");
            divSecondaryModalTitle.id = "div_secondary_modal_title";
            divSecondaryModalTitle.classList.add("div_modal_title");
            divSecondaryModalTitleWrapper.appendChild(divSecondaryModalTitle);

            // Button Close
            var buttonCloseSecondaryModal = document.createElement("button");
            buttonCloseSecondaryModal.id = "button_close_secondary_modal";
            buttonCloseSecondaryModal.classList.add("button_close_modal");
            buttonCloseSecondaryModal.textContent = "X";
            divSecondaryModalTitleWrapper.appendChild(buttonCloseSecondaryModal);

        // Secondary Modal Content Wrapper
        var divSecondaryModalContentWrapper = document.createElement("div");
        divSecondaryModalContentWrapper.id = "div_secondary_modal_content_wrapper";
        divSecondaryModalContentWrapper.classList.add("div_modal_content_wrapper");
        divSecondaryModal.appendChild(divSecondaryModalContentWrapper);

        // Secondary Modal Controls Wrapper
        var divSecondaryModalControlsWrapper = document.createElement("div");
        divSecondaryModalControlsWrapper.id = "div_secondary_modal_controls_wrapper";
        divSecondaryModalControlsWrapper.classList.add("div_modal_controls_wrapper");
        divSecondaryModal.appendChild(divSecondaryModalControlsWrapper);

    // Event listeners
    buttonCloseMainModal.addEventListener("click", function(){
            isModalActive = false;
            divMainModal.classList.toggle("closed");
            divModalOverlay.classList.toggle("closed");
        });
    
    buttonCloseSecondaryModal.addEventListener("click", function(){
        // Switch back the focusable elements to the main modal
        focusableContent = divMainModal.querySelectorAll(focusableElements);
        firstFocusableElement = focusableContent[0];
        lastFocusableElement = focusableContent[focusableContent.length - 1];
        firstFocusableElement.focus();

        // The modal overlay is usually brought higher when the secondary modal is brought up.
        divModalOverlay.style.zIndex = 2;
        divSecondaryModal.classList.toggle("closed");
    });
}

/**
 * A function that shows a modal. Used for a myriad of things, from simple errors to showing sub-menus for saving, loading and deleting templates and their settings. Can also call for a secondary modal internally.
 * 
 * @param {*} content This dictates what kind of content the modal will show.
 * @param  {...any} params A list of parameters. It varies between each case, unfortunately.
 * @returns {*} 
 */
 async function showMainModal(content, ...params){

    var divModalOverlay                 = document.getElementById("div_modal_overlay");
    var divMainModal                    = document.getElementById("div_main_modal");
    var divMainModalTitle               = document.getElementById("div_main_modal_title");
    var divMainModalContentWrapper      = document.getElementById("div_main_modal_content_wrapper");
    var divMainModalControlsWrapper     = document.getElementById("div_main_modal_controls_wrapper");

    // Clean up the previous content
    divMainModalTitle.textContent = "Alert";
    cleanWrapper(divMainModalContentWrapper);
    cleanWrapper(divMainModalControlsWrapper);

    var templateSettingsList;

    switch(content){

        case "save_template_settings":

            // TITLE
            divMainModalTitle.textContent = "Save Template Settings";

            // CONTENT

            // Text content
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "Please enter a name for the settings:"
            divMainModalContentWrapper.appendChild(divMainModalText);

            // Input text
            var inputTextMainModal = document.createElement("input");
            inputTextMainModal.type = "text";
            inputTextMainModal.value = "New settings";
            inputTextMainModal.required = true;
            inputTextMainModal.maxLength = 100;
            divMainModalContentWrapper.appendChild(inputTextMainModal);

            templateSettingsList = await getTemplateSettingsList(params[1].id);
            console.log(params[1]);

            if(templateSettingsList){
                if(templateSettingsList.length > 0){ 
                    // List of all current settings for this template
                    // Title for the list
                    var divTemplateSettingsListTitle = document.createElement("div");
                    divTemplateSettingsListTitle.textContent = "Saved settings for this template:";
                    divMainModalContentWrapper.appendChild(divTemplateSettingsListTitle);

                    // List
                    var divTemplateSettingsList = document.createElement("div");
                    divTemplateSettingsList.classList.add("div_modal_template_settings_list");
                    divMainModalContentWrapper.appendChild(divTemplateSettingsList);

                    for(let li of templateSettingsList){

                        // Create the list element
                        let divTemplateSettingListElement = document.createElement("div");
                        divTemplateSettingListElement.classList.add("div_modal_template_settings_list_element");
                        divTemplateSettingListElement.textContent = li.name;

                        // Add a little function when a user click on the element
                        divTemplateSettingListElement.addEventListener("click", function(){
                            inputTextMainModal.value = li.name;
                        });

                        divTemplateSettingsList.appendChild(divTemplateSettingListElement);

                    }
                }
            }

            // CONTROLS

            // Save button
            var buttonSaveTemplateSettingsMainModal = document.createElement("button");
            buttonSaveTemplateSettingsMainModal.textContent = "Save";
            divMainModalControlsWrapper.appendChild(buttonSaveTemplateSettingsMainModal);

            // EVENT LISTENERS

            buttonSaveTemplateSettingsMainModal.addEventListener("click", async function(){

                let isNameTaken = false;
                if(templateSettingsList){
                    for(li of templateSettingsList){
                        isNameTaken = li.name == inputTextMainModal.value;
                        if(isNameTaken){
                            break;
                        }
                    }
                }

                if(isNameTaken){

                    // Open secondary modal
                    var divSecondaryModal = document.getElementById("div_secondary_modal");
                    var divSecondaryModalTitle = document.getElementById("div_secondary_modal_title");
                    var divSecondaryModalContentWrapper = document.getElementById("div_secondary_modal_content_wrapper");
                    var divSecondaryModalControlsWrapper = document.getElementById("div_secondary_modal_controls_wrapper");

                    // Clean previous content
                    cleanWrapper(divSecondaryModalContentWrapper);
                    cleanWrapper(divSecondaryModalControlsWrapper);
                    
                    // Title
                    divSecondaryModalTitle.textContent = "Warning";

                    // Warning text
                    var divWarning = document.createElement("div");
                    divWarning.textContent = "This name is already used by another setting of this template. Proceed anyway?";
                    divSecondaryModalContentWrapper.appendChild(divWarning);

                    // Buttons
                    var buttonYes = document.createElement("button");
                    buttonYes.textContent = "Yes";
                    divSecondaryModalControlsWrapper.appendChild(buttonYes);

                    var buttonNo = document.createElement("button");
                    buttonNo.textContent = "No";
                    divSecondaryModalControlsWrapper.appendChild(buttonNo);

                    // Move up the modal overlay
                    divModalOverlay.style.zIndex = 4;

                    // Event listeners
                    buttonYes.addEventListener("click", async function(){
                        let isSaveSuccessful = await saveTemplateSettings(inputTextMainModal.value, params[0], params[1].id, true);

                        if(isSaveSuccessful !== true){
                            alert("Could not save. Error: "+isSaveSuccessful);
                            return;
                        }

                        // Update the settings on all templates
                        udpateGeneratorTemplateSettingsAll(params[1].id);

                        // Close the modals
                        divModalOverlay.style.zIndex = 2;
                        divMainModal.classList.toggle("closed");
                        divModalOverlay.classList.toggle("closed");
                        divSecondaryModal.classList.toggle("closed");

                        // Actually, show a message for the user
                        showMainModal("save_template_settings_successful");
                    });

                    buttonNo.addEventListener("click", function(){
                        divModalOverlay.style.zIndex = 2;
                        divSecondaryModal.classList.toggle("closed");
                    })

                    // Switch the focusable elements
                    focusableContent = divSecondaryModal.querySelectorAll(focusableElements);
                    firstFocusableElement = focusableContent[0];
                    lastFocusableElement = focusableContent[focusableContent.length - 1];
                    firstFocusableElement.focus();

                    // Toggle modal
                    divSecondaryModal.classList.toggle("closed");
                }else{
                    // Try to save the settings
                    let isSaveSuccessful = await saveTemplateSettings(inputTextMainModal.value, params[0], params[1].id);

                    // Update the settings on all templates
                    udpateGeneratorTemplateSettingsAll(params[1].id);

                    // Close the modals
                    divModalOverlay.style.zIndex = 2;
                    divMainModal.classList.toggle("closed");
                    divModalOverlay.classList.toggle("closed");

                    // Actually, show a message for the user
                    showMainModal("save_template_settings_successful");

                    if(isSaveSuccessful !== true){
                        alert("Could not save. Error: "+isSaveSuccessful);
                    }
                }
            });

        break;

        case "manage_template_settings":
            // TITLE
            divMainModalTitle.textContent = "Editor - Manage Template Settings";

            // CONTENT

            // Text content
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "You can delete template settings from here, if you wish.";
            divMainModalContentWrapper.appendChild(divMainModalText);

            templateSettingsList = await getTemplateSettingsList(params[0].id);

            if(templateSettingsList){
                if(templateSettingsList.length > 0){ 

                    // List of all current settings for this template

                    // Title for the list
                    var divTemplateSettingsListTitle = document.createElement("div");
                    divTemplateSettingsListTitle.textContent = "Saved settings for this template:";
                    divMainModalContentWrapper.appendChild(divTemplateSettingsListTitle);

                    // Create a container
                    var divMainModalTemplateSettingsListWrapper = document.createElement("div");
                    divMainModalTemplateSettingsListWrapper.classList.add("div_main_modal_template_settings_list_wrapper");
                    divMainModalContentWrapper.appendChild(divMainModalTemplateSettingsListWrapper);

                    for(let templateSettings of templateSettingsList){

                        // Create a container
                        let divMainModalTemplateSettingsWrapper = document.createElement("div");
                        divMainModalTemplateSettingsWrapper.classList.add("div_main_modal_template_settings_wrapper");
                        divMainModalTemplateSettingsListWrapper.appendChild(divMainModalTemplateSettingsWrapper);

                        // Create the element
                        let divMainModalTemplateSettings = document.createElement("div");
                        divMainModalTemplateSettings.classList.add("div_main_modal_template_setting");
                        divMainModalTemplateSettings.textContent = templateSettings.name;
                        divMainModalTemplateSettingsWrapper.appendChild(divMainModalTemplateSettings);

                        // Create a button to delete the template settings
                        let buttonMainModalTemplateSettingsDelete = document.createElement("button");
                        buttonMainModalTemplateSettingsDelete.classList.add("button_main_modal_template_settings_delete");
                        buttonMainModalTemplateSettingsDelete.textContent = "Delete";
                        divMainModalTemplateSettingsWrapper.appendChild(buttonMainModalTemplateSettingsDelete);

                        // EVENT LISTENERS
                        buttonMainModalTemplateSettingsDelete.addEventListener("click", function(){
                            
                            // Open secondary modal
                            var divSecondaryModal = document.getElementById("div_secondary_modal");
                            var divSecondaryModalTitle = document.getElementById("div_secondary_modal_title");
                            var divSecondaryModalContentWrapper = document.getElementById("div_secondary_modal_content_wrapper");
                            var divSecondaryModalControlsWrapper = document.getElementById("div_secondary_modal_controls_wrapper");

                            // Clean previous content
                            cleanWrapper(divSecondaryModalContentWrapper);
                            cleanWrapper(divSecondaryModalControlsWrapper);

                            // Title
                            divSecondaryModalTitle.textContent = templateSettings.name;

                            // Warning text
                            var divWarning = document.createElement("div");
                            divWarning.textContent = "This will delete those settings. Are you really sure?";
                            divSecondaryModalContentWrapper.appendChild(divWarning);

                            // Buttons
                            var buttonYes = document.createElement("button");
                            buttonYes.textContent = "Yes";
                            divSecondaryModalControlsWrapper.appendChild(buttonYes);

                            var buttonNo = document.createElement("button");
                            buttonNo.textContent = "No";
                            divSecondaryModalControlsWrapper.appendChild(buttonNo);

                            // Move up the modal overlay
                            divModalOverlay.style.zIndex = 4;

                            // Event listeners
                            buttonYes.addEventListener("click", async function(){
                                let isDeleteSuccessful = await deleteTemplateSettings(templateSettings.name, params[0].id);

                                // Close this modal
                                divModalOverlay.style.zIndex = 2;
                                divSecondaryModal.classList.toggle("closed");

                                if(isDeleteSuccessful == true){
                                    console.log("hello");
                                    cleanWrapper(divMainModalTemplateSettingsWrapper);
                                    divMainModalTemplateSettingsWrapper.remove();
                                    udpateGeneratorTemplateSettingsAll(params[0].id);
                                }
                                else{
                                    alert("Could not delete. Error: "+isDeleteSuccessful);
                                }
                            });

                            buttonNo.addEventListener("click", function(){
                                divModalOverlay.style.zIndex = 2;
                                divSecondaryModal.classList.toggle("closed");
                            });

                            // Switch the focusable elements
                            focusableContent = divSecondaryModal.querySelectorAll(focusableElements);
                            firstFocusableElement = focusableContent[0];
                            lastFocusableElement = focusableContent[focusableContent.length - 1];
                            firstFocusableElement.focus();

                            // Toggle modal
                            divSecondaryModal.classList.toggle("closed");
                        });
                    }
                }
            }
        break;

        case "editor_load_template":

            // TITLE
            divMainModalTitle.textContent = "Editor - Load Template";

            // CONTENT

            // Reload templateList
            templateList = await getTemplateList();

            // Create a container for the list
            var divMainModalEditorWrapperTemplateList = document.createElement("div");
            divMainModalEditorWrapperTemplateList.id = "div_main_modal_editor_wrapper_template_list";
            divMainModalContentWrapper.appendChild(divMainModalEditorWrapperTemplateList);

            // Create the list
            for(let template of templateList){

                // Create a container
                var divMainModalEditorTemplateListWrapper = document.createElement("div");
                divMainModalEditorTemplateListWrapper.classList.add("div_main_modal_editor_template_list_wrapper");
                divMainModalEditorWrapperTemplateList.appendChild(divMainModalEditorTemplateListWrapper);

                // Create the element
                var divMainModalEditorTemplateListElement = document.createElement("div");
                divMainModalEditorTemplateListElement.classList.add("div_main_modal_editor_template_list_element");
                divMainModalEditorTemplateListElement.textContent = template.title;
                divMainModalEditorTemplateListWrapper.appendChild(divMainModalEditorTemplateListElement);

                // Create a button to load the template
                var buttonMainModalEditorTemplateLoad = document.createElement("button");
                buttonMainModalEditorTemplateLoad.classList.add("button_main_modal_editor_template_load");
                buttonMainModalEditorTemplateLoad.textContent = "Load";
                divMainModalEditorTemplateListWrapper.appendChild(buttonMainModalEditorTemplateLoad);

                // EVENT LISTENERS
                buttonMainModalEditorTemplateLoad.addEventListener("click", async function(){

                    let thisTemplate = await getTemplate(template.id);

                    loadEditorTemplate(thisTemplate);

                    isModalActive = false;
                    divMainModal.classList.toggle("closed");
                    divModalOverlay.classList.toggle("closed");
                });
            }
        break;

        case "editor_save_template":

            // TITLE

            divMainModalTitle.textContent = "Editor - Save Template";

            // CONTENT

            // Text content
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "This name is already taken by another template that you made. If you save, this will erase this other template and save this one instead. Continue?";
            divMainModalContentWrapper.appendChild(divMainModalText);

            // CONTROLS

            // Ok button
            var buttonOk = document.createElement("button");
            buttonOk.textContent = "Ok";
            divMainModalControlsWrapper.appendChild(buttonOk);

            // Cancel button
            var buttonCancel = document.createElement("button");
            buttonCancel.textContent = "Cancel";
            divMainModalControlsWrapper.appendChild(buttonCancel);

            // EVENT LISTENERS
            buttonOk.addEventListener("click", async function(){
                let result = await saveEditorTemplate(params[0], true);

                console.log(result);
            
                processResultSaveEditorTemplate(params[0], result);

                isModalActive = false;
                divMainModal.classList.toggle("closed");
                divModalOverlay.classList.toggle("closed");
            });

            buttonCancel.addEventListener("click", function(){
                isModalActive = false;
                divMainModal.classList.toggle("closed");
                divModalOverlay.classList.toggle("closed");
            });
            break;

        case "editor_manage_templates" :
            // TITLE
            divMainModalTitle.textContent = "Editor - Manage Templates";

            // CONTENT

            // Text content
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "You can delete templates from here, if you wish.";
            divMainModalContentWrapper.appendChild(divMainModalText);

            // Warning
            var divMainModalWarningText = document.createElement("div");
            divMainModalWarningText.classList.add("div_main_modal_warning_text");
            divMainModalWarningText.textContent = "WARNING: Deleting templates will also remove all settings, categories and elements linked to that template.";
            divMainModalContentWrapper.appendChild(divMainModalWarningText);

            let userTemplateList = await getTemplateList(false,true);

            // Create a container for the list
            var divMainModalEditorWrapperTemplateList = document.createElement("div");
            divMainModalEditorWrapperTemplateList.id = "div_main_modal_editor_wrapper_template_list";
            divMainModalContentWrapper.appendChild(divMainModalEditorWrapperTemplateList);

            if(userTemplateList){
                for(let template of userTemplateList){

                    // Create a container
                    let divMainModalEditorTemplateListWrapper = document.createElement("div");
                    divMainModalEditorTemplateListWrapper.classList.add("div_main_modal_editor_template_list_wrapper");
                    divMainModalEditorWrapperTemplateList.appendChild(divMainModalEditorTemplateListWrapper);

                    // Create the element
                    let divMainModalEditorTemplateListElement = document.createElement("div");
                    divMainModalEditorTemplateListElement.classList.add("div_main_modal_editor_template_list_element");
                    divMainModalEditorTemplateListElement.textContent = template.title;
                    divMainModalEditorTemplateListWrapper.appendChild(divMainModalEditorTemplateListElement);

                    // Create a button to delete the template
                    let buttonMainModalEditorTemplateDelete = document.createElement("button");
                    buttonMainModalEditorTemplateDelete.classList.add("button_main_modal_editor_template_delete");
                    buttonMainModalEditorTemplateDelete.textContent = "Delete";
                    divMainModalEditorTemplateListWrapper.appendChild(buttonMainModalEditorTemplateDelete);

                    // EVENT LISTENER
                    buttonMainModalEditorTemplateDelete.addEventListener("click", function(){

                        // Open secondary modal
                        var divSecondaryModal = document.getElementById("div_secondary_modal");
                        var divSecondaryModalTitle = document.getElementById("div_secondary_modal_title");
                        var divSecondaryModalContentWrapper = document.getElementById("div_secondary_modal_content_wrapper");
                        var divSecondaryModalControlsWrapper = document.getElementById("div_secondary_modal_controls_wrapper");

                        // Clean previous content
                        cleanWrapper(divSecondaryModalContentWrapper);
                        cleanWrapper(divSecondaryModalControlsWrapper);
                        
                        // TITLE
                        divSecondaryModalTitle.textContent = template.title;

                        // Warning text
                        var divWarning = document.createElement("div");
                        divWarning.textContent = "This will delete this template. Are you really sure?";
                        divSecondaryModalContentWrapper.appendChild(divWarning);

                        // CONTROLS

                        // Yes
                        var buttonYes = document.createElement("button");
                        buttonYes.textContent = "Yes";
                        divSecondaryModalControlsWrapper.appendChild(buttonYes);

                        // No
                        var buttonNo = document.createElement("button");
                        buttonNo.textContent = "No";
                        divSecondaryModalControlsWrapper.appendChild(buttonNo);

                        // Move up the modal overlay
                        divModalOverlay.style.zIndex = 4;

                        // Event listeners
                        buttonYes.addEventListener("click", async function(){
                            let isDeleteSuccessful = await deleteTemplate(template.id);

                            // Close this modal
                            divModalOverlay.style.zIndex = 2;
                            divSecondaryModal.classList.toggle("closed");

                            if(isDeleteSuccessful == true){
                                cleanWrapper(divMainModalEditorTemplateListWrapper);
                                divMainModalEditorTemplateListWrapper.remove();
                            }
                            else{
                                alert("Could not delete. Error: "+isDeleteSuccessful);
                            }
                        });

                        buttonNo.addEventListener("click", function(){
                            divModalOverlay.style.zIndex = 2;
                            divSecondaryModal.classList.toggle("closed");
                        });

                        // Switch the focusable elements
                        focusableContent = divSecondaryModal.querySelectorAll(focusableElements);
                        firstFocusableElement = focusableContent[0];
                        lastFocusableElement = focusableContent[focusableContent.length - 1];
                        firstFocusableElement.focus();

                        // Toggle modal
                        divSecondaryModal.classList.toggle("closed");
                    });
                }
            }
            
            break;

        case "account_delete_template" :
            // TITLE
            divMainModalTitle.textContent = params[0].title;

            // CONTENT

            // Add the warning
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "This will delete this template and all associated categories, elements and settings. Are you sure?";
            divMainModalContentWrapper.appendChild(divMainModalText);

            // CONTROLS

            // Yes
            var buttonYes = document.createElement("button");
            buttonYes.textContent = "Yes";
            divMainModalControlsWrapper.appendChild(buttonYes);

            // No
            var buttonNo = document.createElement("button");
            buttonNo.textContent = "No";
            divMainModalControlsWrapper.appendChild(buttonNo);
            
            // Event listeners
            buttonYes.addEventListener("click", async function(){
                let isDeleteSuccessful = await deleteTemplate(params[0].id);

                // Close this modal
                divMainModal.classList.toggle("closed");
                divModalOverlay.classList.toggle("closed");

                if(isDeleteSuccessful == true){
                    cleanWrapper(params[1]);
                    params[1].remove();
                }
                else{
                    alert("Could not delete. Error: "+isDeleteSuccessful);
                }
            });

            buttonNo.addEventListener("click", function(){
                divMainModal.classList.toggle("closed");
                divModalOverlay.classList.toggle("closed");
            });

            break;

        case "account_delete_template_settings" :

            // TITLE
            divMainModalTitle.textContent = params[1];

            // CONTENT

            // Add the warning
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "This will delete these template settings. Are you sure?";
            divMainModalContentWrapper.appendChild(divMainModalText);

            // CONTROLS

            // Yes
            var buttonYes = document.createElement("button");
            buttonYes.textContent = "Yes";
            divMainModalControlsWrapper.appendChild(buttonYes);

            // No
            var buttonNo = document.createElement("button");
            buttonNo.textContent = "No";
            divMainModalControlsWrapper.appendChild(buttonNo);
            
            // Event listeners
            buttonYes.addEventListener("click", async function(){
                let isDeleteSuccessful = await deleteTemplateSettings(params[1], params[0].id);

                // Close this modal
                divMainModal.classList.toggle("closed");
                divModalOverlay.classList.toggle("closed");

                if(isDeleteSuccessful == true){
                    cleanWrapper(params[2]);
                    params[2].remove();
                }
                else{
                    alert("Could not delete. Error: "+isDeleteSuccessful);
                }
            });

            buttonNo.addEventListener("click", function(){
                divMainModal.classList.toggle("closed");
                divModalOverlay.classList.toggle("closed");
            });

            break;

        case "save_template_successful":
            // TITLE
            divMainModalTitle.textContent = "Save successful";

            // CONTENT

            // Text content
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "Template saved!"
            divMainModalContentWrapper.appendChild(divMainModalText);

            // CONTROLS
            var buttonOk = document.createElement("button");
            buttonOk.textContent = "Ok";
            divMainModalControlsWrapper.appendChild(buttonOk);

            buttonOk.addEventListener("click", function(){
                    isModalActive = false;
                    divMainModal.classList.toggle("closed");
                    divModalOverlay.classList.toggle("closed");
                });
            break;

        case "save_template_settings_successful":
            // TITLE
            divMainModalTitle.textContent = "Save successful";

            // CONTENT

            // Text content
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "Settings saved!"
            divMainModalContentWrapper.appendChild(divMainModalText);

            // CONTROLS
            var buttonOk = document.createElement("button");
            buttonOk.textContent = "Ok";
            divMainModalControlsWrapper.appendChild(buttonOk);

            buttonOk.addEventListener("click", function(){
                    isModalActive = false;
                    divMainModal.classList.toggle("closed");
                    divModalOverlay.classList.toggle("closed");
                });
            break;

        case "error_min_max" :
            // TITLE
            divMainModalTitle.textContent = "Error - Min / Max";

            // CONTENT

            // Text content
            var divMainModalText = document.createElement("div");
            divMainModalText.classList.add("div_modal_text");
            divMainModalText.textContent = "You can't have your minimal value higher than your maximal value nor your maximal value lower than your minimal value!"
            divMainModalContentWrapper.appendChild(divMainModalText);

            // CONTROLS
            var buttonOk = document.createElement("button");
            buttonOk.textContent = "Ok";
            divMainModalControlsWrapper.appendChild(buttonOk);

            buttonOk.addEventListener("click", function(){
                    isModalActive = false;
                    divMainModal.classList.toggle("closed");
                    divModalOverlay.classList.toggle("closed");
                });
            break;

        default:
            // Why are we here? Don't show the modal and bugger off
            console.log("Error when trying to load modal. Check the params called.");
            return false;
    }
    // Now to trap the focus

    // Get all the focusable elements from the modal

    // Adapted from: https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700

    // Note: This code only works if the modal does not change once loaded (ie. adding new buttons in the modal)
    focusableContent = divMainModal.querySelectorAll(focusableElements);
    firstFocusableElement = focusableContent[0];
    lastFocusableElement = focusableContent[focusableContent.length - 1];
    firstFocusableElement.focus();
    
    // Show the modal and the overlay to prevent clicking outside the modal
    isModalActive = true;
    divMainModal.classList.toggle("closed");
    divModalOverlay.classList.toggle("closed");
}


// DATABASE ACCESS

// When you need to make some AJAX requests

// Template

/**
 * Function to get the list of our templates.
 * 
 * @returns {*} {Promise} Returns a Promise with either a list of our templates (as objects), or an error.
 */

 async function getTemplateList(defaultList = true, userList = true) {

    // Use makeHTTPRequest from XMLHttpRequest.js to get the template list
    let request = await makeHTTPRequest( "templateList", 
                                        "/generateur/php/get_post/get_template_list.php", 
                                        ["defaultList", "userList"], 
                                        [defaultList, userList], 
                                        "GET");

    console.log(request);
    return JSON.parse(request);
}


/**
 * Returns a template object, either from our loaded templates or from the database.
 * 
 * @param {Integer} id An integer corresponding to a template id 
 * @returns {*} {Promise} A promise with either the requested template (associative array of objects) or an error.
 */

 async function getTemplate(id) {

    // Make the request
    let request = await makeHTTPRequest(     "template", 
                                "/generateur/php/get_post/get_template.php", 
                                "id", 
                                id,  
                                "GET");
    
    console.log(request);
    // The request is a JSON string, parse it to get our template.
    newTemplate = JSON.parse(request);

    // Add the template to our loaded templates
    loadedTemplates.push(newTemplate);

    // Return the template
    return newTemplate;
}

// Categories

/**
 * Function to get all supported category types.
 */

 async function getCategoryTypesList(){
    let request = await makeHTTPRequest(    "categoryTypesList",
                                            "/generateur/php/get_post/get_category_types_list.php",
                                            "",
                                            "",
                                            "GET");
    console.log(request);
    return JSON.parse(request);
}


// Settings

/**
 * Gets all the associated settings (for this user) for the given template ID, and returns the list of settings.
 * 
 * @param {*} templateID 
 * @returns {*} 
 */

async function getTemplateSettingsList(templateID) {

    // Use makeHTTPRequest from XMLHttpRequest.js to get the template settings list
    let request = await makeHTTPRequest("template_settings_list", 
                                        "/generateur/php/get_post/get_template_settings_list.php", 
                                        "templateID", 
                                        templateID, 
                                        "GET");
    console.log(request);
    return JSON.parse(request);
}

/**
 * Get the specified settings from the database, if possible.
 * 
 * @param {*} templateID 
 * @param {*} templateSettingsName 
 * @returns {*} 
 */

async function getTemplateSettings(templateID, templateSettingsName){

    // Use makeHTTPRequest from XMLHttpRequest.js to get the template settings
    let request = await makeHTTPRequest("template_settings",
                                        "/generateur/php/get_post/get_template_settings.php",
                                        ["template_ID", "template_settings_name"],
                                        [templateID, templateSettingsName],
                                        "GET");
    console.log(request);
    return JSON.parse(request);
}



/**
 * Save the currents settings of a template.
 * 
 * @param {*} name 
 * @param {*} settings 
 * @param {*} templateID 
 * @param {*} isForceSave 
 * @returns {*} 
 */

async function saveTemplateSettings(name, settings, templateID, isForceSave = false){

    encodedSettings = JSON.stringify(settings);
    
    let request = await makeHTTPRequest("save_template_settings", 
                                        "/generateur/php/get_post/post_save_template_settings.php", 
                                        ["template_settings_name", "template_settings", "template_ID", "isForceSave"], 
                                        [name, encodedSettings, templateID, isForceSave], 
                                        "POST");
    console.log(request);
    return JSON.parse(request);
}

/**
 * Delete the settings owned by the user calling from the database.
 * 
 * @param {*} name The name of the template settings we're deleting. They don't have other identificators (the couple userID / name is enough, given that it is unique).
 * @returns {*} Results of the request
 */

async function deleteTemplateSettings(name, templateID){

    // Use makeHTTPRequest from XMLHttpRequest.js to delete the template setting
    let request = await makeHTTPRequest("template_settings",
                                        "/generateur/php/get_post/post_delete_template_settings.php",
                                        ["name","template_id"],
                                        [name, templateID],
                                        "POST");
    console.log(request);
    return JSON.parse(request);
}

// Editor

/**
 * Saves a template to the database. Hopefully.
 * 
 * @param {*} template Template object
 * @param {*} isForceSave Will erase templates owned by the user with the same name if set to True
 * @returns {*} 
 */

async function saveEditorTemplate(template, isForceSave = false){
    json_template = JSON.stringify(template);

    let request = await makeHTTPRequest("save_template",
                                        "/generateur/php/get_post/post_save_template.php",
                                        ["json_template", "isForceSave"],
                                        [json_template, isForceSave],
                                        "POST");
    console.log(request);
    return JSON.parse(request);
}

/**
 * Deletes a template from the database. Hepefully.
 * 
 * @param {*} templateID 
 * @returns {*} 
 */

async function deleteTemplate(templateID){
    let request = await makeHTTPRequest("delete_template",
                                        "/generateur/php/get_post/post_delete_template.php",
                                        "template_id",
                                        templateID,
                                        "POST");

    console.log(request);

    return JSON.parse(request);
}