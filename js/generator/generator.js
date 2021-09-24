/**
 * Add the basic HTML code to the generator.
 */

 function addGenerator(){
    
    // Set up the generate button

    // Identify our div_generator
    var divGenerator = document.getElementById("div_generator"); // /!\

    // Create a container for the controls (only the global GENERATE button for now)
    var divWrapperGeneratorControls = document.createElement("div");
    divWrapperGeneratorControls.id = "div_wrapper_generator_controls";

    // Create the GENERATE button
    var buttonGenerate = document.createElement("button");
    buttonGenerate.id = "button_generate";
    buttonGenerate.textContent = "GENERATE";

    // Add the button to its container, and the container to the generator
    divWrapperGeneratorControls.appendChild(buttonGenerate);
    divGenerator.appendChild(divWrapperGeneratorControls);

    // Create a container for our results, add it to the generator
    var divWrapperResultBoxes = document.createElement("div");
    divWrapperResultBoxes.id = "div_wrapper_result_boxes";
    divGenerator.appendChild(divWrapperResultBoxes);

    // Create a container for all the templates, add it to the generator
    var divWrapperTemplates = document.createElement("div");
    divWrapperTemplates.id = "div_wrapper_templates";
    divGenerator.appendChild(divWrapperTemplates);

    // EVENT LISTENERS

    buttonGenerate.addEventListener("click", function(){generate();});

}

/**
 * Generates the HTML code (and the javascript associated functions) for a template, and adds it to the generator.
 * 
 * @param {*} template 
 * @param {*} settings 
 * @returns {*} 
 */

async function addTemplateToGenerator(template = defaultTemplate, settings = undefined){

    // Check that the template exists
    if(!template){
        console.log("Could not add the template to the generator: invalid template.");
        return 0;
    }

    // We use currentTemplate to keep track of the currently loaded template in this box
    var currentTemplate = template;

    // Add the template to our currentTemplates
    currentTemplates.push(template);

    // Each template box will have an identifier, to help with "which result box is which"
    // There may be a more elegant approach to this
    templateBoxIdentifier = currentTemplates.length;

    // RESULT BOX

    // Identify our wrapper for the result boxes
    var divWrapperResultBoxes = document.getElementById("div_wrapper_result_boxes");

    // Create a result box
    var divResultBox = document.createElement("div");
    divResultBox.classList.add("div_result_box");

    // Create a result title, add it to the box
    var divResultTitle = document.createElement("div");
    divResultTitle.classList.add("div_result_title");
    divResultTitle.textContent = currentTemplate.title;
    divResultBox.appendChild(divResultTitle);

    // Create a container for our result
    var divResult = document.createElement("div");
    divResult.classList.add("div_result");
    divResultBox.appendChild(divResult);

    // Add it to the wrapper
    divWrapperResultBoxes.appendChild(divResultBox);


    // TEMPLATE

    // Identify our wrapper for the template
    divWrapperTemplates = document.getElementById("div_wrapper_templates");

    // Create a div template
    var divTemplate = document.createElement("div");
    divTemplate.classList.add("div_template_id_"+currentTemplate.id);

    // Add it to the wrapper
    divWrapperTemplates.appendChild(divTemplate);


    // TEMPLATE TITLE

    // Add an inner box for the template title
    var divTemplateTitle = document.createElement("div");
    divTemplateTitle.classList.add("div_template_title");
    divTemplateTitle.textContent = currentTemplate.title;

    // Add it to the div template
    divTemplate.appendChild(divTemplateTitle);

    // TEMPLATE MAIN CONTROLS

    // Add a wrapper for all the controls
    var divWrapperTemplateControls = document.createElement("div");
    divWrapperTemplateControls.classList.add("div_wrapper_template_controls");

    // Add it to the div template
    divTemplate.appendChild(divWrapperTemplateControls);
    
        // BUTTONS

        // Add a wrapper for the main control buttons
        var divWrapperTemplateButtons = document.createElement("div");
        divWrapperTemplateButtons.classList.add("div_wrapper_template_buttons");

        // Add it to the previous wrapper
        divWrapperTemplateControls.appendChild(divWrapperTemplateButtons);
        
            // CHANGE TEMPLATE

            // Create a button to show the change template controls (hidden by default)
            var buttonChangeTemplate = document.createElement("button");
            buttonChangeTemplate.classList.add("button_change_template");
            buttonChangeTemplate.textContent = "Change";

            // Add the button to the wrapper
            divWrapperTemplateButtons.appendChild(buttonChangeTemplate);

            // CANCEL CHANGE TEMPLATE
            
            // Create a button to cancel (and hide) the change template controls
            var buttonCancelChangeTemplate = document.createElement("button");
            buttonCancelChangeTemplate.classList.add("button_cancel_change_template");
            buttonCancelChangeTemplate.textContent = "Cancel";
            buttonCancelChangeTemplate.hidden = true;
            
            // Add the button to the wrapper
            divWrapperTemplateButtons.appendChild(buttonCancelChangeTemplate);

            // COPY TEMPLATE

            // Create a button to copy this template
            var buttonCopyTemplate = document.createElement("button");
            buttonCopyTemplate.classList.add("button_copy_template");
            buttonCopyTemplate.textContent = "Copy";

            // Add the button to our wrapper
            divWrapperTemplateButtons.appendChild(buttonCopyTemplate);

            // REMOVE TEMPLATE

            // Create a button to remove this template
            var buttonRemoveTemplate = document.createElement("button");
            buttonRemoveTemplate.classList.add("button_remove_template");
            buttonRemoveTemplate.textContent = "Remove";

            // Add the button to our wrapper
            divWrapperTemplateButtons.appendChild(buttonRemoveTemplate);

            // WRAPPER - CHANGE TEMPLATE CONTROLS

            // A wrapper containing all the "Change template" controls, hidden by default

            // Create the wrapper
            var divWrapperChangeTemplateControls = document.createElement("div");
            divWrapperChangeTemplateControls.classList.add("div_wrapper_change_template_controls");
            divWrapperChangeTemplateControls.hidden = true;
            
            // Add the wrapper to the previous one
            divWrapperTemplateControls.appendChild(divWrapperChangeTemplateControls);

                // SELECT TEMPLATE

                // Create the "select template" select, add a class
                var selectTemplate = document.createElement("select");
                selectTemplate.classList.add("select_template");

                // Add each template from the list
                var templateListLength = templateList.length;

                for(let i = 0; i<templateListLength; i++){

                    // Create the option for this template
                    var option = document.createElement("option");

                    // Value should be the ID
                    option.value = templateList[i].id;

                    // Text should be the template's title
                    // TODO: Maybe trim it a bit (here or at the select?) if it's too long.
                    option.text = templateList[i].title;

                    // Add the option to the select
                    selectTemplate.add(option);

                    // Set the selected option to this one if it's our current template
                    if(option.value == template.id){
                        selectTemplate.options[i].selected = true;
                    }
                }

                // Add the select to our wrapper
                divWrapperChangeTemplateControls.appendChild(selectTemplate);


                // SETTINGS

                // Create the "select template settings" select, add a class
                var selectTemplateSettings = document.createElement("select");
                selectTemplateSettings.classList.add("select_template_settings");

                // Add the select to our wrapper
                divWrapperChangeTemplateControls.appendChild(selectTemplateSettings);

                // Add the options
                udpateGeneratorTemplateSettings(divTemplate, template.id);
                
                // BUTTONS
                
                // Create a mini wrapper for the change template buttons
                var divWrapperChangeTemplateButtons = document.createElement("div");
                divWrapperChangeTemplateButtons.classList.add("div_wrapper_change_template_buttons");

                // Add it to our previous wrapper
                divWrapperChangeTemplateControls.appendChild(divWrapperChangeTemplateButtons);

                    // LOAD

                    // Create the load button
                    var buttonLoadTemplate = document.createElement("button");
                    buttonLoadTemplate.classList.add("button_load_template");
                    buttonLoadTemplate.textContent= "Load";

                    // Add the button to the wrapper
                    divWrapperChangeTemplateButtons.appendChild(buttonLoadTemplate);

                    // SAVE

                    // Create the save button
                    var buttonSaveTemplateSettings = document.createElement("button");
                    buttonSaveTemplateSettings.classList.add("button_save_template");
                    buttonSaveTemplateSettings.textContent = "Save";

                    // Add the button to the wrapper
                    divWrapperChangeTemplateButtons.appendChild(buttonSaveTemplateSettings);
    
                    // MANAGE SETTINGS

                    // Create the manage settings button
                    var buttonManageTemplateSettings = document.createElement("button");
                    buttonManageTemplateSettings.classList.add("button_manage_template_");
                    buttonManageTemplateSettings.textContent = "Manage Settings";

                    // Add the button to the wrapper
                    divWrapperChangeTemplateButtons.appendChild(buttonManageTemplateSettings);

    // Add the contents of the template
    addTemplateContentsToTemplateBox(currentTemplate, settings, divTemplate);


    // EVENT LISTENERS

    // Unlock the change template controls
    buttonChangeTemplate.addEventListener("click", 
        function(){

            // Hide this button
            buttonChangeTemplate.hidden = true;

            // Unhide the other button and the controls
            buttonCancelChangeTemplate.hidden = false;
            divWrapperChangeTemplateControls.hidden = false;
        });

    // Hide the change template controls
    buttonCancelChangeTemplate.addEventListener("click",
        function(){

            // Hide this button and the controls
            buttonCancelChangeTemplate.hidden = true;
            divWrapperChangeTemplateControls.hidden = true;

            // Unhide the change template button
            buttonChangeTemplate.hidden = false;
        })
    
    // "Copy" the template
    buttonCopyTemplate.addEventListener("click",
        function(){
            var settings = readGenerator(divTemplate, "template");

            addTemplateToGenerator(currentTemplate, settings);
        });
    
    // Remove the template
    buttonRemoveTemplate.addEventListener("click",
        function(){

            // Remove this template
            divTemplate.remove();

            // Remove the linked result box
            divResultBox.remove();
        });
    
    selectTemplate.addEventListener("change",
        function(){
            var selectedTemplateID = selectTemplate.selectedOptions[0].value;
            udpateGeneratorTemplateSettings(divTemplate, selectedTemplateID);
        });

    // Load the new template and settings when the user presses the load button
    buttonLoadTemplate.addEventListener("click", 
        async function(){
            
            // Grab the current selected option value, which should be the id
            var selectedTemplateID = selectTemplate.selectedOptions[0].value;
            var selectTemplateSettingsOption = selectTemplateSettings.selectedOptions[0];

            // Check that we're not on the default option
            if(selectedTemplateID != 0){
                currentTemplate = await getTemplate(selectedTemplateID);

                var newSettings;
                
                if(selectTemplateSettingsOption.value != 0){
                    newSettings = await getTemplateSettings(selectTemplateSettingsOption.value, selectTemplateSettingsOption.text);
                }

                // Change the classlist
                divTemplate.classList.remove("div_template_id_"+template.id);
                divTemplate.classList.add("div_template_id_"+selectedTemplateID);

                // Change the title
                divTemplateTitle.textContent = currentTemplate.title;

                // Change the select settings

                udpateGeneratorTemplateSettings(divTemplate, selectedTemplateID);

                // Remove the contents
                cleanUpTemplateBox(divTemplate);

                // Add the new content
                addTemplateContentsToTemplateBox(currentTemplate, newSettings, divTemplate);

                // Change the result box title

                divResultTitle.textContent = currentTemplate.title;
                
                // Hide the cancel change button and the controls
                buttonCancelChangeTemplate.hidden = true;
                divWrapperChangeTemplateControls.hidden = true;

                // Unhide the change template button
                buttonChangeTemplate.hidden = false;
        }
    });

    // Save the settings when the user presses the save button
    buttonSaveTemplateSettings.addEventListener("click",
        function(){

            if(!isUserRegistered){
                // User is a guest or not recognized, throw an error
                // TODO: Use modal rather than alert
                alert("You can only save new template settings with an account. Sorry!");
                return;
            }

            showMainModal("save_template_settings", readGenerator(divTemplate, "template"), currentTemplate);
            console.log(currentTemplate);
        });
    
    // Open the modal to manage the settings when the user presses the manage settings button
    buttonManageTemplateSettings.addEventListener("click", function(){
        if(!isUserRegistered){
            // User is a guest or not recognized, throw an error
            // TODO: Use modal rather than alert
            alert("You can't have any template settings without an account. Sorry!");
            return;
        }

        showMainModal("manage_template_settings", currentTemplate);
    });
}


/**
 * Get the ID of a template on the page.
 * 
 * @param {*} divTemplate 
 * @returns {*} 
 */

function getTemplateIDOfDivTemplate(divTemplate){
    return divTemplate.className.match(/(\d+)/)[0];
}

/**
 * Add the adequate contents (with the given settings) to a given template box.
 * 
 * @param {*} newTemplate 
 * @param {*} settings 
 * @param {*} divTemplate 
 */
function addTemplateContentsToTemplateBox(newTemplate, settings, divTemplate){

    // WRAPPER

    // Another wrapper containing the differents rows of categories that follow
    divWrapperWrappersCategories = document.createElement("div");
    divWrapperWrappersCategories.classList.add("div_wrapper_wrappers_categories");

    // Add the wrapper to the divTemplate
    divTemplate.appendChild(divWrapperWrappersCategories);

    // CATEGORIES

    // Two options: Either settings is undefined, and we proceed with the default settings (one row for each category), or we load the settings (using a custom function for that)

    if(settings == undefined){ 
        
        // Default settings

        // Add each category as a new row

        for(let category of newTemplate.categories) {

            // Create a wrapper for this category
            var divWrapperCategory = document.createElement("div");
            divWrapperCategory.classList.add("div_wrapper_category");

            // Add the wrapper for this category
            divWrapperWrappersCategories.appendChild(divWrapperCategory);

            // Add the category
            addCategory(category, newTemplate, divWrapperCategory);
        }
    }else{
        loadSettings(settings, divWrapperWrappersCategories);
    }
}

/**
 * Removes all templates from the HTML code (as long as they're correctly inside the template box).
 * @param {*} divTemplate 
 */

 function cleanUpTemplateBox(divTemplate) {
    var divWrapper = divTemplate.getElementsByClassName("div_wrapper_wrappers_categories")[0];

    while(divWrapper.firstChild){
        divWrapper.removeChild(divWrapper.firstChild);
    }

    divWrapper.remove();
}

/**
 * Tries to get a template from our loaded templates with this id.
 * 
 * DEPRECATED - UNUSED
 * 
 * @param {*} id 
 * @returns {*} 
 */

/* 
function getTemplateFromLoadedTemplates(id){

    let l = loadedTemplates.length;

    for(let i = 0; i<l; i++){
        if(loadedTemplates[i].id == id){
            return loadedTemplates[i];
        }
    }

    return null;
}
 */

// CATEGORIES

/**
 * Add a category from a template in the appropriate container (and the appropriate template box).
 * 
 * @param {Object} category The category that we have to add.
 * @param {Object} template The template where we add this category.
 * @param {Object} wrapper The "line" where we add this category.
 * 
 * @returns {*} {HTMLElement} The new HTML Element <div> for this category, aka divCategory. This is useful for moving around categories inside a wrapper.
 */

 function addCategory(category, template, wrapper){

    // CATEGORY

    // Create the new category
    var divCategory = document.createElement("div");

    // Add the appropriate classes, storing the category.id and category.type. We use classes and not ids because we may have to copy this category later on (and multiple elements with the same id is a big no-no)
    divCategory.classList.add("div_category_id_"+category.id);
    divCategory.classList.add("category_type"+category.type);

    // Add the element to the wrapper
    wrapper.appendChild(divCategory);

    // WRAPPER: TITLE, SELECT CATEGORY

    // Add a wrapper for the title and the select category
    var divWrapperCategoryTitleSelect = document.createElement("div");
    divWrapperCategoryTitleSelect.classList.add("div_wrapper_category_title_select");

    // Add the wrapper to the div category
    divCategory.appendChild(divWrapperCategoryTitleSelect);

        // CATEGORY TITLE

        // Create a title for the category
        var divCategoryTitle = document.createElement("div");
        divCategoryTitle.classList.add("div_category_title");
        divCategoryTitle.textContent = category.title;

        // Add it to the wrapper
        divWrapperCategoryTitleSelect.appendChild(divCategoryTitle);

        // SELECT CATEGORY

        // A select to change the current category. Hidden by default, unlocked by the "Change category" button, hidden again by the "Cancel change" button.

        // Create the select category
        var selectCategory = document.createElement("select");
        selectCategory.classList.add("select_category");
        selectCategory.hidden = true;

        // Add it to the wrapper
        divWrapperCategoryTitleSelect.appendChild(selectCategory);

            // OPTIONS - CATEGORIES

            // Create and add an option for each category in this select.

            for(let c of template.categories){

                // Create an option
                var optionCategory = document.createElement("option");
                optionCategory.classList.add("option_select_category");
                optionCategory.text = c.title;
                // We store the id in the value
                optionCategory.value = c.id;

                // If this category is our current one, set the default select to this one
                if(c.id == category.id){
                    optionCategory.selected = true;
                }

                // Add the option to the select
                selectCategory.add(optionCategory);
            }

    // CONTROLS

    // Create a wrapper for the controls
    var divWrapperControlsCategory = document.createElement("div");
    divWrapperControlsCategory.classList.add("div_wrapper_control_category");

    // Add the wrapper to the category
    divCategory.appendChild(divWrapperControlsCategory);

        // CHANGE CATEGORY

        // A button to change the current category into another one. It unlocks the select that is hidden behind the category title.

        // Create the button
        var buttonChangeCategory = document.createElement("button");
        buttonChangeCategory.classList.add("button_change_category");
        buttonChangeCategory.textContent = "Change";

        // Add it to the wrapper
        divWrapperControlsCategory.appendChild(buttonChangeCategory);

        // CANCEL CHANGE

        // A button to cancel the change, hiding the select and putting back the title. Hidden by default.

        // Create the button
        var buttonCancelChangeCategory = document.createElement("button");
        buttonCancelChangeCategory.classList.add("button_cancel_change_category");
        buttonCancelChangeCategory.textContent = "Cancel";
        buttonCancelChangeCategory.hidden = true;

        // Add it to the wrapper
        divWrapperControlsCategory.appendChild(buttonCancelChangeCategory);

        // COPY

        // This "copies" a category. Not really, though: it just takes the same category and add it to the wrapper (at the end of the line).

        // Create the button
        var buttonCopyCategory = document.createElement("button");
        buttonCopyCategory.classList.add("button_copy_category");
        buttonCopyCategory.textContent= "Copy";

        // Add it to the wrapper
        divWrapperControlsCategory.appendChild(buttonCopyCategory);

        // REMOVE

        // This removes a category and, if the wrapper is empty, removes it.

        // Create the button
        var buttonRemoveCategory = document.createElement("button");
        buttonRemoveCategory.classList.add("button_remove_category");
        buttonRemoveCategory.textContent= "Remove";

        // Add it to the wrapper
        divWrapperControlsCategory.appendChild(buttonRemoveCategory);

    // ELEMENTS

    // Create a wrapper for the elements
    var divWrapperElements = document.createElement("div");
    divWrapperElements.classList.add("div_wrapper_elements")

    // Add it to the category
    divCategory.appendChild(divWrapperElements);

        // SELECT

        // Create the main select
        var selectElement = document.createElement("select");
        selectElement.classList.add("select_element");

        // Add it to the wrapper
        divWrapperElements.appendChild(selectElement);

        // OPTIONS

            // DEFAULT - RANDOM ELEMENT

            // Create the default option, which is Random
            var optionRandomElement = document.createElement("option");
            optionRandomElement.text = "Random \uD83C\uDFB2";

            // This class is specifically so people don't break the code by naming an element Random \uD83C\uDFB2

            optionRandomElement.classList.add("random_element");

            selectElement.add(optionRandomElement);

            // CATEGORY - NUMBER

            // We have to add an additional option, "Choose a number", if this category's type is number.

            // Create the inputNumber variable outside so it can be seen in the EventListeners
            var inputNumber;

            // Check if it's the good type
            if(category.type == "number"){

                // Create the option to choose a number
                var optionChooseNumber = document.createElement("option");
                optionChooseNumber.text = "Choose a number";
                optionChooseNumber.classList.add("choose_number");
                selectElement.add(optionChooseNumber);

                // Add a box to display min, max and step
                var divRandomNumberWrapper = document.createElement("div");
                divRandomNumberWrapper.classList.add("div_random_number_wrapper");
                divWrapperElements.appendChild(divRandomNumberWrapper);

                // Add an hidden input
                inputNumber = document.createElement("input");
                inputNumber.type = "number";
                inputNumber.classList.add("input_number");
                inputNumber.hidden = true;

                if(Number.isFinite(category.number_min)){
                    inputNumber.min = category.number_min;

                    var divRandomNumberMin = document.createElement("div");
                    divRandomNumberMin.textContent = "Minimum: " + category.number_min;
                    divRandomNumberWrapper.appendChild(divRandomNumberMin);
                }

                if(Number.isFinite(category.number_max)){
                    inputNumber.max = category.number_max;

                    var divRandomNumberMax = document.createElement("div");
                    divRandomNumberMax.textContent = "Maximum: " + category.number_max;
                    divRandomNumberWrapper.appendChild(divRandomNumberMax);
                }

                if(Number.isFinite(category.decimals)){
                    let step = 1/Math.pow(10, category.decimals);
                    inputNumber.step = step;

                    var divRandomNumberStep = document.createElement("div");
                    divRandomNumberStep.textContent = "Step: " + step;
                    divRandomNumberWrapper.appendChild(divRandomNumberStep);
                }

                // Custom size depending on the number of decimals
                let l = 1;
                if(Number.isFinite(category.number_max) && Number.isFinite(category.decimals)){
                    l = category.number_max.length+parseInt(category.decimals)+1;
                }
                inputNumber.style = "width: "+l+"em";

                // Add it to the category
                divWrapperElements.appendChild(inputNumber);

            }

            // OTHER ELEMENTS

            // We add all the other appropriate elements to the select

            // Browse all the elements of this template
            for(let element of template.elements) {

                // Check that it's the right category
                if(element.category_id == category.id){

                    // Create the option for this element
                    var optionElement = document.createElement("option");
                    optionElement.value = element.title;
                    optionElement.text = element.title;

                    // Add it to the select
                    selectElement.add(optionElement);
                }
            }


    // EVENT LISTENERS

    
    selectCategory.addEventListener("change", 
        function(){
            // Get the new category id
            var selectedCategoryId = selectCategory.selectedOptions[0].value;

            // Check if it's different from our current one
            if(selectedCategoryId != category.id){

                // Get the new category
                var newCategory = getCategoryFromLoadedTemplates(selectedCategoryId);
                
                if(newCategory){
                    var newDivCategory = addCategory(newCategory, template, wrapper);
                    wrapper.insertBefore(newDivCategory, divCategory);
                    removeCategory(divCategory, wrapper);
                }
            }
        });

    buttonChangeCategory.addEventListener("click",
        function(){
            // Hide the category title and this button
            buttonChangeCategory.hidden = true;
            divCategoryTitle.hidden = true;

            // Unhide the select category and the cancel change button
            buttonCancelChangeCategory.hidden = false;
            selectCategory.hidden = false;
        });

    buttonCancelChangeCategory.addEventListener("click",
        function(){
            // Hide the select category and this button
            buttonCancelChangeCategory.hidden = true;
            selectCategory.hidden = true;

            // Unhide the category title and the change button
            buttonChangeCategory.hidden = false;
            divCategoryTitle.hidden = false;
        });
    buttonCopyCategory.addEventListener("click", 
        function(){addCategory(category, template, wrapper);});

    buttonRemoveCategory.addEventListener("click", 
        function(){removeCategory(divCategory, wrapper)})

    selectElement.addEventListener("change",
        function() {
            var option = selectElement.selectedOptions[0];

            switch(option.className){

                case "choose_number":
                    if(inputNumber){
                        inputNumber.hidden = false;
                        divRandomNumberWrapper.hidden = true;
                    }
                break;

                default:
                    if(inputNumber){
                        inputNumber.hidden = true;
                        divRandomNumberWrapper.hidden = false;
                    }
                break;
            }

        });
    
    return divCategory;
}

/**
 * Removes a category. No warning. NOTHING.
 * 
 * @param {HTMLElement} divCategory 
 * @param {HTMLElement} wrapper The wrapper containing this divcategory. Normally, we could access it through parent nodes but, eyh.
 */

function removeCategory (divCategory, wrapper){
    // We just… remove it.
    divCategory.remove();

    // Check if the wrapper is empty
    if(wrapper.children.length == 0){
        wrapper.remove();
    }

}

/**
 * Code that runs whenever we change the select within a category, allowing for multiple inputs to be displayed for the user (for example, the possibility to choose a number).
 * 
 * @param {Event} event 
 * @param {Object} category - Unused parameter as of now.
 */

function changeSelectElement(event, category){
    
    var select = event.target
    var wrapper = select.parentElement;
    var option = select.selectedOptions[0];

    switch(option.className){

        case "choose_number":
            // Add the input to the wrapper
            wrapper.appendChild(input);

        break;

        default:
            //clear everything that's after the select, just in case
            while(select.nextSibling){
                wrapper.removeChild(select.nextSibling);
            }

    }
}


/**
 * Returns the category object with the given id if it can be found inside the given template. Returns null if not.
 * 
 * @param {*} id The id of the category we're looking for.
 * @param {Object} template A template object.
 * @returns {*} Either the category object (from the template) or 0 if it can't be found.
 */

function getCategoryFromTemplate(categoryID, template){

    for(let c of template.categories){
        if(c.id == categoryID){
            return c;
        }
    }

    return null;
}

/**
 * Returns the category object with the given id if it can be found inside the list of loaded templates.
 * @param {*} categoryID 
 * @returns {*} 
 */

function getCategoryFromLoadedTemplates(categoryID){

    var l = loadedTemplates.length;

    for(let i = 0; i<l; i++){
        var category = getCategoryFromTemplate(categoryID, loadedTemplates[i]);
        if (category){
            return category;
        }
    }

    return null;
}

/**
 * Returns a template from our loadedTemplates array containing the category with this categoryID.
 * 
 * @param {*} categoryID
 * @returns {*} 
 */

function getLoadedTemplateOfCategoryId(categoryID){

    var l = loadedTemplates.length;

    for(let i = 0; i<l; i++){
        if (getCategoryFromTemplate(categoryID, loadedTemplates[i])){
            return loadedTemplates[i];
        }
    }

    return null;
}

/**
 * Returns an array of element objects from the given template with the appropriate category, the category being given as an id.
 * 
 * @param {Integer} categoryID The id of the elements' category we want.
 * @param {Object} template The template we're looking in.
 * @returns {*} An array with those elements (as objects). The array is empty if no elements are found.
 */

function getElementsOfCategoryIdFromTemplate(categoryID, template){
    var elements = [];

    for(let e of template.elements){
        if(e.category_id == categoryID){
            elements.push(e);
        }
    }

    return elements;
}


// SETTINGS

// See also tools.js, in Database Access

/**
 * Load the given settings for the target (ie. a template)
 * 
 * Note: The name might be a bit misleading, given that saveSettings accesses the database, while loadSettings does not. But that's how it is.
 * 
 * @param {*} settings 
 * @param {*} divTarget 
 */

function loadSettings(settings, divTarget){
    switch(settings.type){

        case "wrapper_category":

            // Create the wrapper, add it to the current target
            var divWrapperCategory = document.createElement("div");
            divWrapperCategory.classList.add("div_wrapper_category");
            divTarget.appendChild(divWrapperCategory);

            // Loop on the children
            for(child of settings.children){
                loadSettings(child, divWrapperCategory);
            }

            break;

        case "category":

            // Get the appropriate category and template
            var category = getCategoryFromLoadedTemplates(settings.category_id);
            var template = getLoadedTemplateOfCategoryId(settings.category_id);

            // Create the div category
            var divCategory = addCategory(category, template, divTarget);
            var selectElement = divCategory.getElementsByClassName("select_element")[0];

            // Now to read the settings
            switch(settings.category_element_selected){

                case "random_element":
                    selectElement.options[0].selected;
                    break;
                
                case "choose_number":

                    selectElement.options[1].selected;

                    var inputNumber = divCategory.getElementsByClassName("input_number")[0];
                    inputNumber.style.hidden = false;
                    inputNumber.value = settings.category_element_value;

                    break;
                
                default:
                    var l = selectElement.options.length;

                    for(i = 0; i<l; i++){

                        let option = selectElement.options[i];

                        if(option.value == settings.category_element_value){
                            option.selected = true;
                            break;
                        }
                    }
                    break;
            }
            break;

        default:
            // Get to the children
            for(child of settings.children){
                loadSettings(child, divTarget);
            }
            break;
    }
}


/**
 * Udpates the template (as in the HTML object) with the correct ID to show the correct settings list. Useful when the user saves, edits or deletes settings.
 * 
 * @param {*} divTemplate 
 * @param {*} templateID 
 */

 async function udpateGeneratorTemplateSettings(divTemplate, templateID){
    var selectTemplateSettings = divTemplate.getElementsByClassName("select_template_settings")[0];

    while(selectTemplateSettings.firstChild){
        selectTemplateSettings.firstChild.remove();
    }

    // Create the default option "Default settings"
    var optionDefaultSettings = document.createElement("option");
    optionDefaultSettings.value = 0;
    optionDefaultSettings.text = "Default settings";

    // Add the default option
    selectTemplateSettings.add(optionDefaultSettings);

    // Add all the user template settings
    if(isUserRegistered){
        var templateSettingsList = await getTemplateSettingsList(templateID);

        if(templateSettingsList.length > 0){ 

            for(templateSettings of templateSettingsList){
                // Create the option, add it to the select
                var optionTemplateSettings = document.createElement("option");
                optionTemplateSettings.text = templateSettings.name;

                // We store the template id in the value
                optionTemplateSettings.value = templateID;

                selectTemplateSettings.add(optionTemplateSettings);
            }
        }
    }
}

/**
 * Updates all the templates on the page with the corresponding ID. Useful when the user saves, edits or deletes settings.
 * 
 * @param {*} templateID 
 */

async function udpateGeneratorTemplateSettingsAll(templateID){
    var divTemplates = document.querySelectorAll("div[class^=div_template_id_]");

    for(divTemplate of divTemplates){
        if(getTemplateIDOfDivTemplate(divTemplate) == templateID){
            await udpateGeneratorTemplateSettings(divTemplate, templateID);
        }
    }
}


// GENERATION

// The meat. The terrifying, convoluted meat.

/* There are two ways for doing this.

The first way would require to update a "string" of the elements each time the user manipulates them. For example, it would be initialized with the default template as:

{genre:random,mode:random,plot:random,tone:random}

Then, whenever a user select one option, you update the string. When you generate, you just have to read the operations and act accordingly.

The issue with that is two-fold: one, the code for updating the string is all over the place, which make it hard to read and understand. Two, related to that, bugs can be quite deceptive and hard to pinpoint, and the code becomes more and more convoluted and heavy with each element you have to add to the string, most notably the hypothetical logic operators I would like to add.

The other way, which is not better (it has issues itself) is to "read" the template once the user clicks, and to generate according to that reading. The critical issue with this method is that you expect a specific HTML structure, and any meaningful alteration to it must be reflected in the code. However, I much prefer this way, so that's how it is.

*/

/**
 * Reads the generator (more precisely the wrapper containing the templates) and translates it into a sort of tree of objects that represents the generator, allowing us to store its current settings or generate things. This is done recursively.
 * 
 * @param {HTMLElement} divCurrent The current recursion level, in a way. Starts at the HTML Element with the id "generator" by default.
 * @param {string} divType What type of HTML element we're iterating on. Default is "generator". Accepted values are "generator", "template", "wrapper_category" and "category".
 * 
 * @returns {*} {Object} A node of the tree, containing all of its children. Each node is generated recursively.
 */

function readGenerator(divCurrent = document.getElementById("div_wrapper_templates"), divType = "wrapper_template"){

    // This is a recursive function. We do globally the same thing, but not totally.

    var node = {};

    var divContent = [];
    var divTypeNext;

    switch(divType){
        case "wrapper_template":

            // We are at the beginning: we get the templates
            divContent = divCurrent.querySelectorAll("div[class^=div_template_id_]");
            divTypeNext = "template";
            node.type = "wrapper_template";
            node.title = "wrapper_template";

            break;

        case "template":

            // We are reading a template: we get each "line" of categories inside it
            divContent = divCurrent.getElementsByClassName("div_wrapper_category");
            divTypeNext = "wrapper_category";
            node.type = "template";

            divTemplateTitle = divCurrent.getElementsByClassName("div_template_title")[0];
            node.title = divTemplateTitle.textContent;

            break;

        case "wrapper_category":

            // We are reading a "line" of categories: we get each category inside it
            divContent = divCurrent.querySelectorAll("div[class^=div_category_id_]");
            divTypeNext = "category";
            node.type = "wrapper_category";
            node.title = "wrapper";

            break;

        default:
            // We are reading a category. Time to get its content and store it.

            // Find its id (stored in its class)
            var id = divCurrent.className.match(/(\d+)/)[0];

            // Find the category object in our loaded templates
            var category = getCategoryFromLoadedTemplates(id);

            if(category){
                node.type = "category";
                node.title = category.title;

                // Only one select per category as of now. And it's the one we're looking for now anyway.
                var mainSelect = divCurrent.getElementsByClassName("select_element")[0];
                var selectedOptions = mainSelect.selectedOptions;

                node.category_id = id;
                node.category_element_selected = selectedOptions[0].className;

                switch(node.category_element_selected){
                    case "random_element":

                        // Sets up a default value
                        node.category_element_value = "?";
                        break;

                    case "choose_number":
                        // Find the input
                        var inputNumber = mainSelect.parentNode.getElementsByTagName("input")[0];
                        node.category_element_value = inputNumber.value;
                        break;

                    default:
                        // Not random, not choose a number: the user selected a fixed value
                        node.category_element_value = selectedOptions[0].value;
                }
                // I tried to do the return here but it was not working? Very strange.

            }else{

                // Could not find the category in the current template, which means SHENANIGANS
                console.log("error!");
            }

            break;
    }

    node.children = [];

    // If divContent is empty, which is the case if we're in the default case earlier (we don't change it from the base value), this loop won't start, ending the function
    for(let divElement of divContent){
        node.children.push(readGenerator(divElement,divTypeNext));
    }

    return node;
}

/**
 * Generates what has been set as "random" on a tree… that's not very clear. But I know what it means!
 * 
 * @param {*} tree 
 * @param {*} combineSameIdCategoriesInWrapper 
 */
function generateOnTree(tree, combineSameIdCategoriesInWrapper = true){

    switch(tree.type){
        case "wrapper_category":

            // Get into the children
            for(let c of tree.children){
                generateOnTree(c);
            }

            // Check the option
            if(combineSameIdCategoriesInWrapper){
                // Combine nodes if they have the same category id: category_element_values are added to eachother with a delimiter (comma)
                // WARNING: By default, does NOT combine identical category_element_values into one

                // TODO: Add that option you fool.
                tree.children = combineNodeCategoriesWithSameId(tree.children);
            }
        break;
        
        case "category":

        // Time to generate a random element
        if(tree.category_element_selected == "random_element"){
            var template = getLoadedTemplateOfCategoryId(tree.category_id);
            var category = getCategoryFromLoadedTemplates(tree.category_id);
            var elements = getElementsOfCategoryIdFromTemplate(tree.category_id, template);

            if(category.type == "text"){
                // Select a random element from the elements (if possible)
                if(elements.length > 0){
                    let i = randomIntFromInterval(0, elements.length - 1);
                    tree.category_element_value = elements[i].title;
                }
            } else{
                // It's a number type (int or not), so we choose a random number between min and max.
                var minimum;
                var maximum;
                category.number_min == null ? minimum = 0 : minimum = parseInt(category.number_min);
                category.number_max == null ? maximum = 0 : maximum = parseInt(category.number_max); 
                tree.category_element_value = randomNumberFromInterval(minimum, maximum, category.decimals);
            }
        }
        break;

        // Too high on the tree, get lower
        default:
            for(let node of tree.children){
                generateOnTree(node);
            }
        break;
    }

}

/**
 * Exactly what it says.
 * 
 * More seriously, this assures that if you have multiple categories with the same ID in your tree, the code ties them together, so that you do not get one row for each category in your results.
 * 
 * @param {*} arrayNodeCategories 
 * @returns {*} 
 */
function combineNodeCategoriesWithSameId(arrayNodeCategories){

    // Nothing to do if it's one or zero category
    if(arrayNodeCategories.length <= 1){
        return arrayNodeCategories;
    }

    // Our output array
    var arrayOutput = [];

    // Browse the array one by one
    for(let i = 0; i < arrayNodeCategories.length; i++){


        // Current element of the array that we will compare to the following ones
        var arrayTemporaryOutput = [arrayNodeCategories[i]];

        // Next theoretical index
        var j = i+1;

        // As long as this element exists, we start a loop
            // In a way, it's kind of a pile: we're either moving the first to our temporary output if it's the same category id or moving on to the next if not
        while(arrayNodeCategories[j]){

            // Compare this and that
            if(arrayNodeCategories[j].category_id == arrayNodeCategories[i].category_id){

                // Same category, add it to the list
                arrayTemporaryOutput.push(arrayNodeCategories[j]);

                // Remove it from the original array (therefore moving to the following item with j)
                arrayNodeCategories.splice(i+j, 1);

            }else{
                // Next item
                j++;
            }
        }

        // Sort the nodes by value in order to have something a bit more elegant
        arrayTemporaryOutput.sort(compareNodeCategoriesValue);

        for(let k = 1; k<arrayTemporaryOutput.length; k++){

            arrayTemporaryOutput[0].category_element_value += ", "+arrayTemporaryOutput[k].category_element_value;
        }

        // Add the first element (with all the combined values) of our temporary output to the final output
        arrayOutput.push(arrayTemporaryOutput[0]);
    }

    return(arrayOutput);
}

/**
 * Helper function, allowing to compare two values that have been generated on the tree. This ensures that 
 * 
 * @param {*} nodeCategoryA 
 * @param {*} nodeCategoryB 
 * @returns {*} 
 */
function compareNodeCategoriesValue (nodeCategoryA, nodeCategoryB){
    return String(nodeCategoryA.category_element_value).localeCompare(String(nodeCategoryB.category_element_value));
}

/**
 * Gets the output from a tree that has been generated.
 * 
 * Yes this is very clear.
 * 
 * @param {*} tree 
 * @returns {*} 
 */
function outputFromTree(tree){

    var output = "";

    switch(tree.type){
        case "template":
            for(let child of tree.children){
                output += outputFromTree(child)+"\r\n";
            }
        break;

        case "wrapper_category":
            for(let i = 0; i < tree.children.length; i++){
                var delimiter;
                i == (tree.children.length-1) ? delimiter = "" : delimiter = "; ";
                output += outputFromTree(tree.children[i])+ delimiter;
            }
        break;

        case "category":
            output += tree.title + ": " + tree.category_element_value;
        break;

        default:
            output = [];
            for(let child of tree.children){
                output.push(outputFromTree(child));
            }
        break;
    }

    return output;
}

/**
 * GENERATE.
 * 
 * This generates the outputs from the generator then put them in their respective boxes. Nothing more, nothing less.
 */

function generate(){

    var tree = readGenerator();
    generateOnTree(tree);
    var arrayOutput = outputFromTree(tree);

    var divResults = document.getElementsByClassName("div_result");
    var l = divResults.length;

    for(let i = 0; i<l; i++){
        divResults[i].textContent = arrayOutput[i];
    }
}
