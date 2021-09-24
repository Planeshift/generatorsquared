/* EDITOR */

/* 
Include each of these files in an individual script tag, in order, before including this file in its own script tag.

js/common/math.js
js/common/tools.js
js/common/XMLHttpRequest.js

*/

// GLOBAL VARIABLES

// Editor stuff

var categoryTypesList;
var historyTemplates = [];
var loadedCategory;

/**
 * Adds the basic code for the Editor. Only users have access to the Editor though, guests only get the basic treatment.
 * 
 * @returns {*} true if the editor was set up (ie. the user is registered), false otherwise.
 */

function addEditor(){

    // Identify our editor container
    var divEditor = document.getElementById("div_editor");
    
    // Check if it's a guest user
    if(!isUserRegistered){
        // This is an unregistered user.
        // We'll create a small box with an explanation as to why the editor is unavailable.

        var divWrapperWarningGuest = document.createElement("div");
        divWrapperWarningGuest.id = "div_wrapper_warning_guest";
        divEditor.appendChild(divWrapperWarningGuest);

        var divWarningGuestTitle = document.createElement("div");
        divWarningGuestTitle.id = "div_warning_guest_title";
        divWarningGuestTitle.textContent = "Account required";
        divWrapperWarningGuest.appendChild(divWarningGuestTitle);

        var divWarningGuest = document.createElement("div");
        divWarningGuest.id = "div_warning_guest";
        divWarningGuest.textContent = "Sorry, this content is only available for registered users. If you don't have an account, it's quite easy to create one! If you already have one, just log in to gain access to the editor."
        divWrapperWarningGuest.appendChild(divWarningGuest);

        // Wrapper for the links
        var divWrapperAccountLinks = document.createElement("div");
        divWrapperAccountLinks.id = "div_wrapper_account_links";
        divWrapperWarningGuest.appendChild(divWrapperAccountLinks);

        // Add a link to log in
        var aLoginAccount = document.createElement("a");
        aLoginAccount.classList.add("a_account");
        aLoginAccount.href = "/generateur/pages/account/login_account.php";
        aLoginAccount.textContent = "Log in";
        divWrapperAccountLinks.appendChild(aLoginAccount);

        // Add a link to create an account
        var aCreateAccount = document.createElement("a");
        aCreateAccount.classList.add("a_account");
        aCreateAccount.href = "/generateur/pages/account/create_account.php";
        aCreateAccount.textContent = "Create an account";
        divWrapperAccountLinks.appendChild(aCreateAccount);

        // Get out of here, we're done
        return false;
    }

    // If we're here, this is a registered user. Time to create the Editor app for them.

    // Controls

    // Container for the controls
    var divEditorWrapperControls = document.createElement("div");
    divEditorWrapperControls.id = "div_editor_wrapper_controls";

    // Buttons: New template, load template, save template and import categories

    var buttonEditorNewTemplate = document.createElement("button");
    buttonEditorNewTemplate.id = "button_editor_new_template";
    buttonEditorNewTemplate.textContent = "New Template";
    buttonEditorNewTemplate.classList.add("button_editor_main_control");

    var buttonEditorLoadTemplate = document.createElement("button");
    buttonEditorLoadTemplate.id = "button_editor_load_template";
    buttonEditorLoadTemplate.textContent = "Load Template";
    buttonEditorLoadTemplate.classList.add("button_editor_main_control");

    var buttonEditorSaveTemplate = document.createElement("button");
    buttonEditorSaveTemplate.id = "button_editor_save_template";
    buttonEditorSaveTemplate.textContent = "Save Template";
    buttonEditorSaveTemplate.classList.add("button_editor_main_control");

    var buttonEditorManageTemplates = document.createElement("button");
    buttonEditorManageTemplates.id = "button_editor_manage_templates";
    buttonEditorManageTemplates.textContent = "Manage Templates";
    buttonEditorManageTemplates.classList.add("button_editor_main_control");

    /* TODO: this
    var buttonEditorImportCategories = document.createElement("button");
    buttonEditorImportCategories.id = "button_editor_import_categories";
    buttonEditorImportCategories.textContent = "Import Categories";
    buttonEditorImportCategories.classList.add("button_editor_main_control");

    */

    // Add the wrapper and the controls to the editor in proper order
    divEditorWrapperControls.appendChild(buttonEditorNewTemplate);
    divEditorWrapperControls.appendChild(buttonEditorLoadTemplate);
    divEditorWrapperControls.appendChild(buttonEditorSaveTemplate);
    divEditorWrapperControls.appendChild(buttonEditorManageTemplates);
    // divEditorWrapperControls.appendChild(buttonEditorImportCategories);
    divEditor.appendChild(divEditorWrapperControls);

    // Container for the rest of the editor
    var divEditorWrapperColumns = document.createElement("div");
    divEditorWrapperColumns.id = "div_editor_wrapper_columns";

    divEditor.appendChild(divEditorWrapperColumns);

    // Left column

    // Container for the left column
    var divEditorWrapperLeftColumn = document.createElement("div");
    divEditorWrapperLeftColumn.id = "div_editor_wrapper_left_column";
    
    // Wrapper for the title
    var divEditorWrapperTemplateTitle = document.createElement("div");
    divEditorWrapperTemplateTitle.id = "div_editor_wrapper_template_title";

    // Container for the outline and list of categories in the left column
    var divEditorWrapperOutline = document.createElement("div");
    divEditorWrapperOutline.id = "div_editor_wrapper_outline";

    // Outline box
    var divEditorOutline = document.createElement("div");
    divEditorOutline.id = "div_editor_outline";
    divEditorOutline.textContent = "OUTLINE";

    // Container for the list of categories of a template
    var divEditorWrapperCategories = document.createElement("div");
    divEditorWrapperCategories.id = "div_editor_wrapper_categories";

    // Container for the button Add Category
    var divEditorWrapperButtonAddCategory = document.createElement("div");
    divEditorWrapperButtonAddCategory.id = "div_editor_wrapper_button_add_category";

    // Add everything to the document in proper order
    divEditorWrapperColumns.appendChild(divEditorWrapperLeftColumn);
    divEditorWrapperLeftColumn.appendChild(divEditorWrapperTemplateTitle);
    divEditorWrapperLeftColumn.appendChild(divEditorWrapperOutline);
    divEditorWrapperOutline.appendChild(divEditorOutline);
    divEditorWrapperOutline.appendChild(divEditorWrapperCategories);
    divEditorWrapperOutline.appendChild(divEditorWrapperButtonAddCategory);

    // Right column

    // Container for the right column
    var divEditorWrapperRightColumn = document.createElement("div");
    divEditorWrapperRightColumn.id = "div_editor_wrapper_right_column";
    
    // Container for the title of the current category being edited
    var divEditorWrapperCategoryTitle = document.createElement("div");
    divEditorWrapperCategoryTitle.id = "div_editor_wrapper_category_title";

    // Div for the type and other options/modifiers of a category
    var divEditorWrapperCategoryOptions = document.createElement("div");
    divEditorWrapperCategoryOptions.id = "div_editor_wrapper_category_options";

    // Wrapper for the list of elements of a category
    var divEditorWrapperElements = document.createElement("div");
    divEditorWrapperElements.id = "div_editor_wrapper_elements";

    // Add everything to the document in proper order
    divEditorWrapperColumns.appendChild(divEditorWrapperRightColumn);
    divEditorWrapperRightColumn.appendChild(divEditorWrapperCategoryTitle);
    divEditorWrapperRightColumn.appendChild(divEditorWrapperCategoryOptions);
    divEditorWrapperRightColumn.appendChild(divEditorWrapperElements);

    // EVENT LISTENERS

    buttonEditorNewTemplate.addEventListener("click", function(){
        let newTemplate = createEmptyTemplate();

        newTemplate.title = "New Template";

        loadEditorTemplate(newTemplate);
    });

    buttonEditorLoadTemplate.addEventListener("click",
    function(){

        if(!isUserRegistered){
            // User is a guest or not recognized, throw an error
            // TODO: Use modal rather than alert, although normally, the user can't try to load if they're not connected
            alert("You can only use the Editor with a registered account.");
            return;
        }

        showMainModal("editor_load_template");
    });

    buttonEditorSaveTemplate.addEventListener("click", async function(){
        if(!isUserRegistered){
            // User is a guest or not recognized, throw an error
            // TODO: Use modal rather than alert, although normally, the user can't try to save if not connected
            alert("You can only use the Editor with a registered account.");
            return;
        }

        if(historyTemplates.length > 0){
            let template = historyTemplates[historyTemplates.length - 1].template;

            let result = await saveEditorTemplate(template);
            
            processResultSaveEditorTemplate(template, result);
        }
    });

    buttonEditorManageTemplates.addEventListener("click", async function(){
        if(!isUserRegistered){
            // User is a guest or not recognized, throw an error
            // TODO: Use modal rather than alert, although normally, the user can't try to save if not connected
            alert("You can only use the Editor with a registered account.");
            return;
        }

        showMainModal("editor_manage_templates");
    });

    return true;
}

/**
 * As the name suggests: this function does the post-processing of a save in the editor.
 * 
 * result is either:
 *      A string, with three possible values, indicating three possible errors:
 *          unregistered_user - The user was unregistered
 *          post_data_error - Something went wrong when processing the POST data
 *          name_taken - The name of this template is already taken by another template by this user
 *      An object, containing the IDs of the saved template in the database
 * 
 * @param {Object} template - The template object we tried to save
 * @param {*} result - A string (for an error) or an object (when the save succeeded)
 */

function processResultSaveEditorTemplate(template, result){
    switch(result){
        case "unregistered_user":
            alert("You can't save without a registered account.");
        break;

        case "post_data_error":
            alert("Post data error: Something went wrong with the request. I think the dev screwed up the code again…");
        break;

        case "name_taken":
            showMainModal("editor_save_template", template);
        break;

        default:
            if(result.template_id && result.category_ids && result.element_ids){
                // Update ALL history templates with the correct template ID

                // This is in case I do a "undo/redo" functionnality. Unlikely for now, but still.
                for(let ht of historyTemplates){
                    ht.template.id = Number(result.template_id);
                }

                let l = template.categories.length;
                let categoryOrder = 0;
                let temporaryLoadedCategory;

                if(result.category_ids.length == l){
                    for(let i = 0; i<l; i++){
                        let previousID = template.categories[i].id;
                        template.categories[i].id = Number(result.category_ids[i]);

                        if(loadedCategory != null && previousID == loadedCategory.id){
                            temporaryLoadedCategory = template.categories[i];
                            categoryOrder = i;
                        }
                    }
                }else{
                    alert("Something went wrong when inserting/updating the categories. Oh no.");
                }

                l = template.elements.length;
                if(result.element_ids.length == l && result.element_category_ids.length == l){
                    for(let i = 0; i<l; i++){
                        template.elements[i].id = Number(result.element_ids[i]);
                        template.elements[i].category_id = Number(result.element_category_ids[i]);
                    }
                }else{
                    alert("Something went wrong when inserting/updating the elements. Oh no.");
                }

                historyTemplates[historyTemplates.length - 1].saved = true;

                let temporaryHistoryTemplates = historyTemplates;

                // We reload the interface. Why? Well… It's buggy otherwise.

                // Mainly, the interface still uses the fake category IDs, but we just updated them. So nothing would work properly. It's easier to just force a reload of the editor with this saved template.
                loadEditorTemplate(template);
                historyTemplates = temporaryHistoryTemplates;
                
                if(temporaryLoadedCategory != null){
                    let divEditorWrapperCategories = document.getElementById("div_editor_wrapper_categories");
                    loadCategoryToEditor(temporaryLoadedCategory, template, 
                    divEditorWrapperCategories.querySelectorAll(".div_editor_outline_category_title")[categoryOrder]);
                }

                // Finally, show a little message for the user
                showMainModal("save_template_successful");

            }else{
                alert("Something went wrong, but we don't know where. Sorry!");
            }
        break;
    }
}

/**
 * Loads a template to the editor.
 * 
 * @param {Object} template 
 * @returns {*} 
 */

function loadEditorTemplate(template = defaultTemplate){

    // Check that the template exists
    if(!template){
        console.log("Could not load template: invalid template.");
        return 0;
    }

    loadedCategory = null;
    historyTemplates = [{template: template, saved: false}];

    console.log(historyTemplates);
    // Clean the whole editor

    // Get the wrapper for the template title
    var divEditorWrapperTemplateTitle = document.getElementById("div_editor_wrapper_template_title");

    cleanWrapper(divEditorWrapperTemplateTitle);

    // Get the wrapper for the categories in the editor
    var divEditorWrapperCategories = document.getElementById("div_editor_wrapper_categories");

    cleanWrapper(divEditorWrapperCategories);

    // Get the category title wrapper
    var divEditorWrapperCategoryTitle = document.getElementById("div_editor_wrapper_category_title");

    // Clean the wrapper
    cleanWrapper(divEditorWrapperCategoryTitle);
    
    // Get the options wrapper
    var divEditorWrapperCategoryOptions = document.getElementById("div_editor_wrapper_category_options");

    // Clean the wrapper
    cleanWrapper(divEditorWrapperCategoryOptions);
    
    // Get the elements wrapper in the right column
    var divEditorWrapperElements = document.getElementById("div_editor_wrapper_elements");

    cleanWrapper(divEditorWrapperElements);

    // Template title
    var divEditorTemplateTitle = document.createElement("div");
    divEditorTemplateTitle.id = "div_editor_template_title";
    divEditorTemplateTitle.textContent = template.title;
    divEditorWrapperTemplateTitle.appendChild(divEditorTemplateTitle);

    // Input for editing the title, hidden
    var inputEditorTemplateTitle = document.createElement("input");
    inputEditorTemplateTitle.type = "text";
    inputEditorTemplateTitle.id = "input_editor_template_title";
    inputEditorTemplateTitle.value = template.title;
    inputEditorTemplateTitle.maxLength = 100;
    inputEditorTemplateTitle.hidden = true;
    divEditorWrapperTemplateTitle.appendChild(inputEditorTemplateTitle);
    
    // Button for editing the title
    var buttonEditorTemplateTitleEdit = document.createElement("button");
    buttonEditorTemplateTitleEdit.id = "button_editor_template_title_edit";
    buttonEditorTemplateTitleEdit.textContent = "Edit";
    divEditorWrapperTemplateTitle.appendChild(buttonEditorTemplateTitleEdit);

    // Populate the outline
    var categoriesLength = template.categories.length;

    for(let i = 0; i < categoriesLength; i++){
        addNewCategoryToEditor(template.categories[i]);
    }

    // Button to add a new category

    // Get the wrapper
    var divEditorWrapperButtonAddCategory = document.getElementById("div_editor_wrapper_button_add_category");

    // Clean the wrapper
    cleanWrapper(divEditorWrapperButtonAddCategory);

    // Add the button
    var buttonEditorAddCategory = document.createElement("button");
    buttonEditorAddCategory.id = "button_editor_add_category";
    buttonEditorAddCategory.textContent = "Add Category";
    divEditorWrapperButtonAddCategory.appendChild(buttonEditorAddCategory);

    // EVENT LISTENERS

    buttonEditorAddCategory.addEventListener("click", function(){
        let newCategory = setFakeCategoryID(createEmptyCategory());

        saveHistoryTemplates(["title", "type"],["New Category", "text"], newCategory);

        addNewCategoryToEditor(newCategory);
    });

    buttonEditorTemplateTitleEdit.addEventListener("click", function(){
        
        let previousTemplateVersion = historyTemplates[historyTemplates.length - 1].template;
        console.log(previousTemplateVersion);

        // Force the input to be a certain length
        inputEditorTemplateTitle.value.substring(0, 100);
        console.log(inputEditorTemplateTitle.value);

        // If the user has emptied the input, we fill it again with the previous title. A template should always have a title.
        // Note: An empty title can still be achieved by using white spaces and saving the template
        if(inputEditorTemplateTitle.value.length == 0){
            inputEditorTemplateTitle.value = previousTemplateVersion.title;
        }

        // Check that there has been a change
        if(inputEditorTemplateTitle.value != divEditorTemplateTitle.textContent){

            saveHistoryTemplates("title", inputEditorTemplateTitle.value);

            // Do the change in the interface
            divEditorTemplateTitle.textContent = inputEditorTemplateTitle.value;
        }

        // Hide/unhide title and input
        divEditorTemplateTitle.hidden = !divEditorTemplateTitle.hidden;
        inputEditorTemplateTitle.hidden = !inputEditorTemplateTitle.hidden;
    });

    // Load the first category available in the editor, if possible

    if(categoriesLength > 0){

        var category = template.categories[0];

        loadCategoryToEditor(category, template, divEditorWrapperCategories.querySelector(".div_editor_outline_category_title"));
    }

}

/**
 * Adds the given category to the editor.
 * 
 * @param {Object} category 
 */

function addNewCategoryToEditor(category){
    // Get the wrapper for the categories in the editor
    var divEditorWrapperCategories = document.getElementById("div_editor_wrapper_categories");

    // Create a wrapper for this category
    let divEditorWrapperCategory = document.createElement("div");
    divEditorWrapperCategory.classList.add("div_editor_wrapper_category");
    divEditorWrapperCategories.appendChild(divEditorWrapperCategory);

    // Create a category title box
    let divEditorOutlineCategoryTitle = document.createElement("div");
    divEditorOutlineCategoryTitle.classList.add("div_editor_outline_category_title");
    divEditorOutlineCategoryTitle.textContent = category.title;
    divEditorWrapperCategory.appendChild(divEditorOutlineCategoryTitle);

    // Create the box for the controls
    let divEditorOutlineCategoryControls = document.createElement("div");
    divEditorOutlineCategoryControls.classList.add("div_editor_outline_category_controls");
    divEditorWrapperCategory.appendChild(divEditorOutlineCategoryControls);

    // Create the controls

    // Up
    let buttonEditorOutlineCategoryUp = document.createElement("button");
    buttonEditorOutlineCategoryUp.classList.add("button_editor_outline_category_up");
    buttonEditorOutlineCategoryUp.textContent = "Move up";
    divEditorOutlineCategoryControls.appendChild(buttonEditorOutlineCategoryUp);

    // Down
    let buttonEditorOutlineCategoryDown = document.createElement("button");
    buttonEditorOutlineCategoryDown.classList.add("button_editor_outline_category_down");
    buttonEditorOutlineCategoryDown.textContent = "Move down";
    divEditorOutlineCategoryControls.appendChild(buttonEditorOutlineCategoryDown);

    // Edit
    let buttonEditorOutlineCategoryEdit = document.createElement("button");
    buttonEditorOutlineCategoryEdit.classList.add("button_editor_outline_category_edit");
    buttonEditorOutlineCategoryEdit.textContent = "Edit";
    divEditorOutlineCategoryControls.appendChild(buttonEditorOutlineCategoryEdit);

    // Delete
    let buttonEditorOutlineCategoryDelete = document.createElement("button");
    buttonEditorOutlineCategoryDelete.classList.add("button_editor_outline_category_delete");
    buttonEditorOutlineCategoryDelete.textContent = "Delete";
    divEditorOutlineCategoryControls.appendChild(buttonEditorOutlineCategoryDelete);

    // EVENT LISTENERS

    buttonEditorOutlineCategoryUp.addEventListener("click", function(){
        if(HTMLElementMoveUpInContainer(divEditorWrapperCategory)){
            saveHistoryTemplates(undefined,undefined,category,undefined,0,false,"up");
        }
    });

    buttonEditorOutlineCategoryDown.addEventListener("click", function(){
        if(HTMLElementMoveDownInContainer(divEditorWrapperCategory)){
            saveHistoryTemplates(undefined,undefined,category,undefined,0,false,"down");
        }
    });

    buttonEditorOutlineCategoryEdit.addEventListener("click", function(){

        // We must find the current category, not the original one (which is still the "category" variable)
        let currentTemplateVersion = historyTemplates[historyTemplates.length - 1].template;

        let l = currentTemplateVersion.categories.length;
        for(let j = 0; j<l; j++){
            if(category.id == currentTemplateVersion.categories[j].id){
                loadCategoryToEditor(currentTemplateVersion.categories[j], currentTemplateVersion, divEditorOutlineCategoryTitle)
                break;
            }
        }
    });

    buttonEditorOutlineCategoryDelete.addEventListener("click", function(){

        // Do the change in our historytemplates array and save it
        saveHistoryTemplates(undefined,undefined,category,undefined,undefined,true);

        // If the current loaded category is the one we're deleting, we remove it from the interface
        if(category.id == loadedCategory.id){
            let divEditorWrapperCategoryTitle = document.getElementById("div_editor_wrapper_category_title");
            let divEditorWrapperCategoryOptions = document.getElementById("div_editor_wrapper_category_options");
            let divEditorWrapperElements = document.getElementById("div_editor_wrapper_elements");
            cleanWrapper(divEditorWrapperCategoryTitle);
            cleanWrapper(divEditorWrapperCategoryOptions);
            cleanWrapper(divEditorWrapperElements);
        }

        // Clean and remove the wrapper
        cleanWrapper(divEditorWrapperCategory);
        divEditorWrapperCategory.remove();
    });
}

/**
 * Loads a category from a specific template in the right column of the editor. 
 * 
 * @param {Object} category - The category
 * @param {Object} template - The template
 * @param {HTMLObjectElement} divEditorOutlineCategoryTitle - The category title in the left column
 */

function loadCategoryToEditor(category, template, divEditorOutlineCategoryTitle){

    loadedCategory = category;
    // TITLE

    // Get the wrapper
    var divEditorWrapperCategoryTitle = document.getElementById("div_editor_wrapper_category_title");

    // Clean the wrapper
    cleanWrapper(divEditorWrapperCategoryTitle);

    // Create a div for the title of the category
    var divEditorCategoryTitle = document.createElement("div");
    divEditorCategoryTitle.id = "div_editor_category_title";
    divEditorCategoryTitle.textContent = category.title;
    
    // Create an input for the title of the category, hidden
    var inputEditorCategoryTitle = document.createElement("input");
    inputEditorCategoryTitle.type = "text";
    inputEditorCategoryTitle.id = "input_editor_category_title";
    inputEditorCategoryTitle.value = category.title;
    inputEditorCategoryTitle.maxLength = 75;
    inputEditorCategoryTitle.hidden = true;

    // Create a button to edit the title
    var buttonEditorCategoryTitleEdit = document.createElement("button");
    buttonEditorCategoryTitleEdit.id = "button_editor_category_title_edit";
    buttonEditorCategoryTitleEdit.textContent = "Edit";

    // Append everything
    divEditorWrapperCategoryTitle.appendChild(divEditorCategoryTitle);
    divEditorWrapperCategoryTitle.appendChild(inputEditorCategoryTitle);
    divEditorWrapperCategoryTitle.appendChild(buttonEditorCategoryTitleEdit);


    // OPTIONS

    // Get the wrapper
    var divEditorWrapperCategoryOptions = document.getElementById("div_editor_wrapper_category_options");

    // Clean the wrapper
    cleanWrapper(divEditorWrapperCategoryOptions);

    // Create a small label for the select
    var labelSelectEditorCategoryType = document.createElement("label");
    labelSelectEditorCategoryType.setAttribute("for", "select_editor_category_type");
    labelSelectEditorCategoryType.id = "label_select_editor_category_type";
    labelSelectEditorCategoryType.textContent = "Category Type:";
    divEditorWrapperCategoryOptions.appendChild(labelSelectEditorCategoryType);

    // Create a select for the category type, using the category types list
    var selectEditorCategoryType = document.createElement("select");
    selectEditorCategoryType.id = "select_editor_category_type";
    selectEditorCategoryType.name = "select_editor_category_type";
    divEditorWrapperCategoryOptions.appendChild(selectEditorCategoryType);

    for(let categoryType of categoryTypesList){

        // Create an option
        let optionCategoryType = document.createElement("option");
        optionCategoryType.classList.add("option_select_category_type");
        optionCategoryType.text = categoryType;
        optionCategoryType.value = categoryType;

        // If this category is our current one, set the default select to this one
        if(categoryType == category.type){
            optionCategoryType.selected = true;
        }

        // Add the option to the select
        selectEditorCategoryType.add(optionCategoryType);
    }

    // ELEMENTS

    addElementsToEditor(category, template);

    // EVENT LISTENERS
    buttonEditorCategoryTitleEdit.addEventListener("click", function(){

        let previousTemplateVersion = historyTemplates[historyTemplates.length - 1].template;

        // Force the input to be a certain length
        inputEditorCategoryTitle.value.substring(0, 75);

        // If the user has emptied the input, we fill it again with the previous title. A category should always have a title.
        if(inputEditorCategoryTitle.value.length == 0 && category.title){
            let previousCategoryTitle = "Error";
            for(let previousCategory of previousTemplateVersion.categories){
                if(previousCategory.id == category.id){
                    previousCategoryTitle = previousCategory.title;
                    break;
                }
            }
            inputEditorCategoryTitle.value = previousCategoryTitle;
            return;
        }

        // Check that there has been a change
        if(inputEditorCategoryTitle.value != divEditorCategoryTitle.textContent){

            saveHistoryTemplates("title", inputEditorCategoryTitle.value, category);

            // Do the change in the interface
            divEditorOutlineCategoryTitle.textContent = inputEditorCategoryTitle.value;
            divEditorCategoryTitle.textContent = inputEditorCategoryTitle.value;
        }

        // Hide/unhide title and input
        divEditorCategoryTitle.hidden = !divEditorCategoryTitle.hidden;
        inputEditorCategoryTitle.hidden = !inputEditorCategoryTitle.hidden;
    });

    selectEditorCategoryType.addEventListener("change", function(){
        selectedCategoryType = selectEditorCategoryType.selectedOptions[0].value;

        if(saveHistoryTemplates(["type"], selectedCategoryType, category) === true){
            let currentTemplateVersion = historyTemplates[historyTemplates.length - 1].template;
            let currentCategoryVersion;

            for(let currentCategory of currentTemplateVersion.categories){
                if(currentCategory.id == category.id){
                    currentCategoryVersion = currentCategory;
                    break;
                }
            }

            if(currentCategoryVersion != undefined){
                addElementsToEditor(currentCategoryVersion, currentTemplateVersion);
            }
        }

    });
}

/**
 * Adds the content of a category to the editor. If it's a text category, it adds elements; if it's a number category it adds the correct inputs for minimum, maximum and decimals.
 * 
 * @param {Object} category 
 * @param {Object} template 
 */

function addElementsToEditor(category, template){
    // Get the wrapper
    var divEditorWrapperElements = document.getElementById("div_editor_wrapper_elements");

    // Clean the wrapper
    cleanWrapper(divEditorWrapperElements);

    switch(category.type){

        case "text":
            for(let element of template.elements) {

                // Check that it's the right category
                if(element.category_id == category.id){
                    addNewElementToEditor(category, element);
                }
            }

            // Empty input
            addNewElementToEditor(category, setFakeElementID(createEmptyElement()));
        break;

        case "number":

            // Create a label for the minimal value
            var labelEditorMinimalValue = document.createElement("label");
            labelEditorMinimalValue.id = "label_editor_minimal_value";
            labelEditorMinimalValue.htmlFor = "input_editor_minimal_value";
            labelEditorMinimalValue.textContent = "Minimal value";
            divEditorWrapperElements.appendChild(labelEditorMinimalValue);

            // Create an input for the minimal value
            var inputEditorMinimalValue = document.createElement("input");
            inputEditorMinimalValue.type = "number";
            inputEditorMinimalValue.id = "input_editor_minimal_value";
            inputEditorMinimalValue.name = "input_editor_minimal_value";
            inputEditorMinimalValue.value = category.number_min ? category.number_min : 0;
            inputEditorMinimalValue.min = -2147483648;
            inputEditorMinimalValue.max = 2147483647;
            inputEditorMinimalValue.step = category.decimals ? 1/Math.pow(10, category.decimals) : 1;
            divEditorWrapperElements.appendChild(inputEditorMinimalValue);

            // Create a label for the maximal value
            var labelEditorMaximalValue = document.createElement("label");
            labelEditorMaximalValue.id = "label_editor_maximal_value";
            labelEditorMaximalValue.htmlFor = "input_editor_maximal_value";
            labelEditorMaximalValue.textContent = "Maximal value";
            divEditorWrapperElements.appendChild(labelEditorMaximalValue);

            // Create an input for the maximal value
            var inputEditorMaximalValue = document.createElement("input");
            inputEditorMaximalValue.type = "number";
            inputEditorMaximalValue.id = "input_editor_maximal_value";
            inputEditorMaximalValue.name = "input_editor_maximal_value";
            inputEditorMaximalValue.value = category.number_max ? category.number_max : 0;
            inputEditorMaximalValue.min = -2147483648;
            inputEditorMaximalValue.max = 2147483647;
            inputEditorMaximalValue.step = category.decimals ? 1/Math.pow(10, category.decimals) : 1;
            divEditorWrapperElements.appendChild(inputEditorMaximalValue);

            // Create a label for the decimals
            var labelEditorDecimals = document.createElement("label");
            labelEditorDecimals.id = "label_editor_decimals_value";
            labelEditorDecimals.htmlFor = "input_editor_decimals";
            labelEditorDecimals.textContent = "Decimals";
            divEditorWrapperElements.appendChild(labelEditorDecimals);

            // Create an input for the decimals
            var inputEditorDecimals = document.createElement("input");
            inputEditorDecimals.type = "number";
            inputEditorDecimals.id = "input_editor_decimals";
            inputEditorDecimals.name = "input_editor_decimals";
            inputEditorDecimals.value = category.decimals ? category.decimals : 0;
            inputEditorDecimals.min = 0;
            inputEditorDecimals.max = 10;
            inputEditorDecimals.step = 1;
            divEditorWrapperElements.appendChild(inputEditorDecimals);

            // EVENT LISTENERS

            // Given that we apply the same code for both inputs, might as well use a function
            function validateInputEditorMinMax(input, type, newDecimals = null){

                // let otherType = type == "number_min" ? "number_max" : "number_min";

                let inputValue = input.valueAsNumber;

                let currentTemplateVersion = historyTemplates[historyTemplates.length - 1].template;
                let currentCategoryVersion = setFakeCategoryID(createEmptyCategory());

                for(let currentCategory of currentTemplateVersion.categories){
                    if(currentCategory.id == category.id){
                        currentCategoryVersion = currentCategory;
                        break;
                    }
                }

                // Check that the input is a number
                if(Number.isFinite(inputValue)){

                    // We convert the number to a string in order to stripe excessive decimals
                    let inputValueStringSplit = inputValue.toString().split(".");

                    let decimals;
                    
                    if(!Number.isFinite(newDecimals)){
                        decimals = currentCategoryVersion.decimals ? currentCategoryVersion.decimals : 0;
                    }else{
                        decimals = newDecimals;
                    }

                    let inputValueStringNumber = inputValueStringSplit[0];
                    let inputValueStringDecimals = inputValueStringSplit[1] ? inputValueStringSplit[1] : "";

                    // If the number of decimals is too long, we cut them off
                    if(inputValueStringDecimals.length > decimals){
                        inputValueStringDecimals = inputValueStringDecimals.slice(0, decimals);
                    }

                    inputValueString = inputValueStringNumber+"."+inputValueStringDecimals;

                    inputValue = Number(inputValueString);

                    // We force the input to be between the maximal and minimal values an int can take in our database
                    inputValue = Math.max(Math.min(inputValue, 2147483647), -2147483648);

                    // Now we have to compare this number with the other

                    // If this is the minimal value and it's higher than the max, we set it to max and show an error
                    // Same logic if it's the max value
                    if(type == "number_min"){
                        if(inputValue > currentCategoryVersion.number_max){
                            inputValue = currentCategoryVersion.number_max;
                            showMainModal("error_min_max");
                        }
                    }else if(type == "number_max"){
                        if(inputValue < currentCategoryVersion.number_min){
                            inputValue = currentCategoryVersion.number_min;
                            showMainModal("error_min_max");
                        }
                    }

                    // We put the number back into the input     
                    input.value = inputValue;


                }else{
                    // Input is not a number. We use the previous input or, if none can be found, we set it to 0.

                    if(type == "number_min"){
                        input.value = inputValue == currentCategoryVersion.number_min ? currentCategoryVersion.number_min : 0;
                    }else if(type == "number_max"){
                        input.value = inputValue == currentCategoryVersion.number_max ? currentCategoryVersion.number_max : 0;
                    }
                    
                }

                return inputValue;
            }

            inputEditorMinimalValue.addEventListener("change", function(){
                let inputValue = validateInputEditorMinMax(inputEditorMinimalValue, "number_min");
                saveHistoryTemplates("number_min", inputValue, category);
            });


            inputEditorMaximalValue.addEventListener("change", function(){
                let inputValue = validateInputEditorMinMax(inputEditorMaximalValue, "number_max");
                saveHistoryTemplates("number_max", inputValue, category);
            });

            inputEditorDecimals.addEventListener("change", function(){

                let inputValue = inputEditorDecimals.valueAsNumber;

                let currentTemplateVersion = historyTemplates[historyTemplates.length - 1].template;
                let currentCategoryVersion = setFakeCategoryID(createEmptyCategory());

                for(let currentCategory of currentTemplateVersion.categories){
                    if(currentCategory.id == category.id){
                        currentCategoryVersion = currentCategory;
                        break;
                    }
                }

                if(Number.isFinite(inputValue) && inputValue >= 0 && inputValue <= 10 && Math.floor(inputValue) == inputValue){
                    let minValue = validateInputEditorMinMax(inputEditorMinimalValue, "number_min", inputValue);
                    let maxValue = validateInputEditorMinMax(inputEditorMaximalValue, "number_max", inputValue);
                    saveHistoryTemplates(["number_min", "number_max", "decimals"], [minValue, maxValue, inputValue], category);
                    inputEditorMaximalValue.step = 1/Math.pow(10, inputValue);
                    inputEditorMinimalValue.step = 1/Math.pow(10, inputValue);
                }else{
                    inputEditorDecimals.value = currentCategoryVersion.decimals ? currentCategoryVersion.decimals : 0;
                    inputEditorMaximalValue.step = category.decimals ? 1/Math.pow(10, category.decimals) : 1;
                    inputEditorMinimalValue.step = category.decimals ? 1/Math.pow(10, category.decimals) : 1;
                }
            });

        break;

        default:
        break;

    }
}

/**
 * Adds the given element to the category in the editor.
 * 
 * @param {*} category 
 * @param {*} element 
 */

function addNewElementToEditor(category, element){
    // Get the wrapper
    var divEditorWrapperElements = document.getElementById("div_editor_wrapper_elements");

    // Create the element container
    // Note: Maybe NOT the best name, the difference being just an S at the end, but eyh.
    var divEditorWrapperElement = document.createElement("div");
    divEditorWrapperElement.classList.add("div_editor_wrapper_element");
    divEditorWrapperElements.appendChild(divEditorWrapperElement);

    // Create the input
    var inputEditorElement = document.createElement("input");
    inputEditorElement.classList.add("input_editor_element");
    inputEditorElement.type = "text";
    inputEditorElement.maxLength = 60;
    if(element.title != null){
        inputEditorElement.value = element.title;
        elementTitle = element.title;
    }
    divEditorWrapperElement.appendChild(inputEditorElement);

    // Controls

    // Wrapper for the controls

    var divEditorElementControlsWrapper = document.createElement("div");
    divEditorElementControlsWrapper.classList.add("div_editor_element_controls_wrapper");
    divEditorWrapperElement.appendChild(divEditorElementControlsWrapper);

    // Move up
    var buttonEditorElementMoveUp = document.createElement("button");
    buttonEditorElementMoveUp.classList.add("button_editor_element_move_up");
    buttonEditorElementMoveUp.textContent = "Move up";
    divEditorElementControlsWrapper.appendChild(buttonEditorElementMoveUp);
    
    // Move down
    var buttonEditorElementMoveDown = document.createElement("button");
    buttonEditorElementMoveDown.classList.add("button_editor_element_move_down");
    buttonEditorElementMoveDown.textContent = "Move down";
    divEditorElementControlsWrapper.appendChild(buttonEditorElementMoveDown);

    // Delete
    var buttonEditorElementDelete = document.createElement("button");
    buttonEditorElementDelete.classList.add("button_editor_element_delete");
    buttonEditorElementDelete.textContent = "Delete";
    divEditorElementControlsWrapper.appendChild(buttonEditorElementDelete);

    // EVENT LISTENERS

    inputEditorElement.addEventListener("change", function(){

        let previousTemplateVersion = historyTemplates[historyTemplates.length - 1].template;

        // Force the input to be a certain length
        inputEditorElement.value.substring(0, 60);

        // If the user has emptied the input, we fill it again with the previous title (NOT the original one). If the user wants to remove an element, they must use the delete button.
        if(inputEditorElement.value.length == 0 && element.title){
            let previousElementTitle = "Error";
            for(let elem of previousTemplateVersion.elements){
                if(elem.id == element.id){
                    previousElementTitle = elem.title;
                    break;
                }
            }
            inputEditorElement.value = previousElementTitle;
            return;
        }

        // Find the index in the interface
        let index = 0;
        let arrayDivEditorWrapperElements = divEditorWrapperElements.querySelectorAll(".div_editor_wrapper_element");
        let l = arrayDivEditorWrapperElements.length;

        while(index < l){
            if(arrayDivEditorWrapperElements[index] == divEditorWrapperElement){
                break;
            }
            index++;
        }

        saveHistoryTemplates("title", inputEditorElement.value, category, element, index);

        // Add a new element if none of them are empty
        let inputEditorElements = divEditorWrapperElements.querySelectorAll(".input_editor_element");

        for(let input of inputEditorElements){
            if(input.value.length == 0){
                return;
            }
        }

        addNewElementToEditor(category, setFakeElementID(createEmptyElement()));
    });

    // Move up
    buttonEditorElementMoveUp.addEventListener("click", function(){

        // Interface stuff
        // Check if the previousSibling (if it exists) is not an empty input
        let saveChange = true;
        let previousHTMLElement = divEditorWrapperElement.previousSibling;
        if(previousHTMLElement != null){
            let previousInput = previousHTMLElement.querySelector(".input_editor_element");
            if(previousInput != null){
                saveChange = previousInput.value.length > 0;
            }
        }

        // If we moved the element AND we did not swap an empty element AND we did not swap with an empty element, we commit the change
        if(HTMLElementMoveUpInContainer(divEditorWrapperElement) && element.title && saveChange){
            
            saveHistoryTemplates(undefined,undefined,undefined,element, 0, false,"up");
        };
    });

    // Move down
    buttonEditorElementMoveDown.addEventListener("click", function(){

        // Interface stuff
        // Check if the nextSibling (if it exists) is not an empty input
        let saveChange = true;
        let nextHTMLElement = divEditorWrapperElement.nextSibling;
        if(nextHTMLElement != null){
            let nextInput = nextHTMLElement.querySelector(".input_editor_element");
            if(nextInput != null){
                saveChange = nextInput.value.length > 0;
            }
        }

        // If we moved the element AND we did not swap an empty element AND we did not swap with an empty element, we commit the change
        if(HTMLElementMoveDownInContainer(divEditorWrapperElement) && element.title && saveChange){
            saveHistoryTemplates(undefined,undefined,undefined,element, 0, false, "down");
        };
    })

    // Delete
    buttonEditorElementDelete.addEventListener("click", function(){
        let elements = divEditorWrapperElements.querySelectorAll(".div_editor_wrapper_element");

        if(elements.length > 1){

            saveHistoryTemplates(undefined,undefined,undefined,element, 0, true);

            // Clean and remove the wrapper
            cleanWrapper(divEditorWrapperElement);
            divEditorWrapperElement.remove();
        }

        // Add a new element if none of them are empty
        let inputEditorElements = divEditorWrapperElements.querySelectorAll(".input_editor_element");

        for(let input of inputEditorElements){
            if(input.value.length == 0){
                return;
            }
        }

        addNewElementToEditor(category, setFakeElementID(createEmptyElement()));
    })
}

/**
 * Stores changes to the template in the historyTemplates array.
 * 
 * @param {Object} template 
 */

function saveChangeToHistoryTemplates(template){
    historyTemplates.push({template: template, saved: false});
    console.log(historyTemplates);
}

/**
 * Saves the changes done in the editor to HistoryTemplates.
 * 
 * @param {*} keys The keys being changed
 * @param {*} values The associated values being changed
 * @param {*} category The category object that we're updating ; NULL by default
 * @param {*} element The element object that we're updating ; NULL by default
 * @param {*} elementIndex Index of the element we're updating ; NULL by default
 * @param {*} remove True if we're removing the component ; false by default
 * @param {*} move "up" or "down" moves the component up or down in the list ; NULL by default
 * @returns {*} 
 */

function saveHistoryTemplates(  keys = null, 
                                values = null, 
                                category = null, 
                                element = null,
                                elementIndex = 0, 
                                remove = false, 
                                move = null){

    
    let currentTemplateVersion =  historyTemplates[historyTemplates.length - 1].template;
    let newTemplateVersion = cloneDeep(currentTemplateVersion);

    let components;
    let componentID;

    let k = Array.isArray(keys) ? keys : [keys];
    let v = Array.isArray(values) ? values : [values];

    let templateEdit = false;

    if(k.length != v.length){
        return "Error - Keys and values mismatch in length.";
    }

    // Check element before category: when we have both, we're editing an element and need the category.
    // However, we never need an element if we're doing stuff on a category
    if(element != null){
        components = newTemplateVersion.elements;
        componentID = element.id;
    }else if(category != null){
        components = newTemplateVersion.categories;
        componentID = category.id;
    }else{
        if(remove){
            // Should be a throw
            return "Error - Can't remove without an ID, check the input";
        }

        if(move != null){
            // Same
            return "Error - Can't move without an ID, check the input";
        }

        templateEdit = true;
    }

    // Delete component
    if(remove){
        let l = components.length;
        let componentFound = false;

        for(let i = 0; i<l; i++){
            if(componentID == components[i].id){
                components.splice(i, 1);
                componentFound = true;

                // Is it a category we're removing?
                if(category !== null){
                    // We need to remove all the elements from this category
                    let j = 0;

                    while(j < newTemplateVersion.elements.length){
                        if(componentID == newTemplateVersion.elements[j].category_id){
                            // Remove the element
                            newTemplateVersion.elements.splice(j,1);
                        }else{
                            j++;
                        }
                    }
                }

                break;
            }
        }

        if(componentFound){
            historyTemplates.push({template: newTemplateVersion, saved: false});
            console.log(historyTemplates);
            return true;
        }

        // blabla throw bla
        return "Error - Could not find a component with this ID";
    }

    // Move component
    if(move === "up" || move === "down"){
        let l = components.length;
        let componentFound = false;

        for(let i = 0; i<l; i++){
            if(componentID == components[i].id){
                componentFound = true;

                if(move === "up"){
                    // i-1 SHOULD exist. If not, something went wrong somewhere very badly.
                    let tmp = components[i-1];
                    components[i-1] = components[i];
                    components[i] = tmp;

                }else if(move === "down"){
                    // i+1 SHOULD exist. If not, something went wrong somewhere very badly.

                    let tmp = components[i+1];
                    components[i+1] = components[i];
                    components[i] = tmp;
                }
                break;
            }
        }

        if(componentFound){
            historyTemplates.push({template: newTemplateVersion, saved: false});
            console.log(historyTemplates);
            return true;
        }

        return "Error - Could not find a component with this ID";
    }

    // Edit component(s)

    if(!templateEdit){
        let componentFound = false;
        let save = false;

        for(let component of components){
            if(component.id == componentID){
                componentFound = true;

                let l = k.length;

                for(let i = 0; i<l; i++){
                    // We check that we're indeed doing a change, otherwise there's no point in saving
                    if(component[k[i]] != v[i]){
                        component[k[i]] = v[i];
                        save = true;
                    }
                }
                break;
            }
        }

        if(!componentFound){
            if(element != null){
                // New element, therefore, we must set some things up ourselves

                // Give the category id to the element
                element.category_id = category.id;

                // Set up all the key-value pairs

                let l = k.length;

                for(let i = 0; i<l; i++){
                    element[k[i]] = v[i];
                }   

                // Find the beginning of the list of elements of this category in our TemplateVersion
                // Note: Due to how they're constructed, they should already be in order from the get-go. That's why this works. Otherwise, we'd first have to order them which would be a nightmare.
                let indexTemplate = 0;
                l = newTemplateVersion.elements.length;

                while(indexTemplate < l){
                    if(newTemplateVersion.elements[indexTemplate].category_id == category.id){
                        break;
                    }
                    indexTemplate++;
                }

                // Now we just have to splice our element properly
                newTemplateVersion.elements.splice(indexTemplate + elementIndex, 0, element);

                // Set componentFound and save to true to trigger the save
                componentFound = true;
                save = true;
            }else if(category != null){
                // New category
                let l = k.length;

                for(let i = 0; i<l; i++){
                    category[k[i]] = v[i];
                }   

                newTemplateVersion.categories.push(category);

                componentFound = true;
                save = true;
            }
        }

        if(componentFound && save){
            historyTemplates.push({template: newTemplateVersion, saved: false});
            console.log(historyTemplates);
            return true;
        }

        // No save

        return false;
    }

    // Edit template
    let l = k.length;
    let save = false;

    for(let i = 0; i<l; i++){
        // Check that we're changing the value (no point in saving otherwise)
        if(newTemplateVersion[k[i]] != v[i]){
            newTemplateVersion[k[i]] = v[i];
            save = true;
        }
    }
    
    if(save){
        historyTemplates.push({template: newTemplateVersion, saved: false});
        console.log(historyTemplates);
        return true;
    }

    // No save

    return false;

}