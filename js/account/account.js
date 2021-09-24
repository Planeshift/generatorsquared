// ACCOUNT

/* 
Include each of these files in an individual script tag, in order, before including this file in its own script tag.

js/common/math.js
js/common/tools.js
js/common/XMLHttpRequest.js

*/
loadedTemplates = [];

document.addEventListener("DOMContentLoaded", initialize);

var divAccountTemplateList = document.getElementById("div_account_templates_list");
var divAccountTemplateSettingsList = document.getElementById("div_account_template_settings_list");

/**
 * Initialize all the JS code needed in this document.
 */

async function initialize(){

    activateModal();

    var defaultTemplateList = await getTemplateList(true,false);
    var userTemplateList = await getTemplateList(false,true);

    if(defaultTemplateList.length > 0){
        
        // Create a title
        var divAccountDefaultTemplateListTitle = document.createElement("div");
        divAccountDefaultTemplateListTitle.id = "div_account_default_template_list_title";
        divAccountDefaultTemplateListTitle.textContent = "Default Templates";
        divAccountTemplateList.appendChild(divAccountDefaultTemplateListTitle);
        
        populateList(defaultTemplateList);
    }

    if(userTemplateList.length > 0){

        // Create a title
        var divAccountUserTemplateListTitle = document.createElement("div");
        divAccountUserTemplateListTitle.id = "div_account_user_template_list_title";
        divAccountUserTemplateListTitle.textContent = "User Templates";
        divAccountTemplateList.appendChild(divAccountUserTemplateListTitle);
 
        populateList(userTemplateList, false);
    }
}

/**
 * Populates the template list. If defaultList is set to true, then we don't set up the delete buttons.
 * 
 * @param {*} list 
 * @param {*} defaultList 
 */

function populateList(list, defaultList = true){
    for(let template of list){
        console.log(template);

        // Create a small wrapper
        let divAccountTemplateListWrapper = document.createElement("div");
        divAccountTemplateListWrapper.classList.add("div_account_template_list_wrapper");
        divAccountTemplateList.appendChild(divAccountTemplateListWrapper);

        // Name of the template
        let spanAccountTemplateListTemplateName = document.createElement("span");
        spanAccountTemplateListTemplateName.classList.add("span_account_template_list_template_name");
        spanAccountTemplateListTemplateName.textContent = template.title;
        divAccountTemplateListWrapper.appendChild(spanAccountTemplateListTemplateName);

        // Controls wrapper
        let divAccountTemplateListControlsWrapper = document.createElement("div");
        divAccountTemplateListControlsWrapper.classList.add("div_account_template_list_controls_wrapper");
        divAccountTemplateListWrapper.appendChild(divAccountTemplateListControlsWrapper);

        // Button to see the settings
        let buttonAccountTemplateListTemplateViewSettings = document.createElement("button");
        buttonAccountTemplateListTemplateViewSettings.textContent = "View Settings";
        divAccountTemplateListControlsWrapper.appendChild(buttonAccountTemplateListTemplateViewSettings);

        // EVENT LISTENER
        buttonAccountTemplateListTemplateViewSettings.addEventListener("click", function(){
            seeTemplateSettings(template.id);
        });

        if(!defaultList){
            // Button to delete the template
            let buttonAccountTemplateListTemplateDelete = document.createElement("button");
            buttonAccountTemplateListTemplateDelete.textContent = "Delete";
            divAccountTemplateListControlsWrapper.appendChild(buttonAccountTemplateListTemplateDelete);

            // EVENT LISTENER
            buttonAccountTemplateListTemplateDelete.addEventListener("click", function(){
                showMainModal("account_delete_template", template, divAccountTemplateListWrapper);
            });
        }
    }
}

/**
 * A function that allows us to see the settings (in the right column) of a template.
 * 
 * @param {*} templateID 
 */

async function seeTemplateSettings(templateID){

    // Clean the wrapper
    cleanWrapper(divAccountTemplateSettingsList);

    // Get the settings list
    let template = await getTemplate(templateID);
    let templateSettingsList = await getTemplateSettingsList(template.id);

    // Create a Default Settings visualization
    populateSettings(template);

    for(let tS of templateSettingsList){
        let templateSettings = await getTemplateSettings(templateID, tS.name);

        populateSettings(template, templateSettings, tS.name);
    }
}

/**
 * Adds to the settings list the given settings.
 * 
 * @param {*} template 
 * @param {*} templateSettings The template settings we're adding to the template. If left blank, this will load the default settings.
 * @param {*} templateSettingsName 
 */

function populateSettings(template, templateSettings = "", templateSettingsName = ""){

    let isDefaultSettings = templateSettings === "";

    console.log(templateSettings);

    // Big wrapper
    let divAccountTemplateSettingsListBigWrapper = document.createElement("div");
    divAccountTemplateSettingsListBigWrapper.classList.add("div_account_template_settings_list_big_wrapper");
    divAccountTemplateSettingsList.appendChild(divAccountTemplateSettingsListBigWrapper)

    // Small wrapper
    let divAccountTemplateSettingsListWrapper = document.createElement("div");
    divAccountTemplateSettingsListWrapper.classList.add("div_account_template_settings_list_small_wrapper");
    divAccountTemplateSettingsListBigWrapper.appendChild(divAccountTemplateSettingsListWrapper);

    // Title
    let spanAccountTemplateSettingsListName = document.createElement("span");
    spanAccountTemplateSettingsListName.classList.add ("span_account_template_settings_list_name");
    spanAccountTemplateSettingsListName.textContent = isDefaultSettings ? "Default Settings" : templateSettingsName;
    divAccountTemplateSettingsListWrapper.appendChild(spanAccountTemplateSettingsListName);

    // Controls wrapper
    let divAccountTemplateSettingsControlsWrapper = document.createElement("div");
    divAccountTemplateSettingsControlsWrapper.classList.add = ("div_account_template_settings_controls_wrapper");
    divAccountTemplateSettingsListWrapper.appendChild(divAccountTemplateSettingsControlsWrapper);

    // View button
    let buttonAccountTemplateSettingsView = document.createElement("button");
    buttonAccountTemplateSettingsView.classList.add("button_account_template_default_settings_view");
    buttonAccountTemplateSettingsView.textContent = "View";
    divAccountTemplateSettingsControlsWrapper.appendChild(buttonAccountTemplateSettingsView);
    
    if(!isDefaultSettings){
        // Button to delete the template settings
        let buttonAccountTemplateSettingsDelete = document.createElement("button");
        buttonAccountTemplateSettingsDelete.textContent = "Delete";
        divAccountTemplateSettingsControlsWrapper.appendChild(buttonAccountTemplateSettingsDelete);

        // EVENT LISTENER
        buttonAccountTemplateSettingsDelete.addEventListener("click", function(){
            showMainModal("account_delete_template_settings", template, templateSettingsName, divAccountTemplateSettingsListBigWrapper);
        });
    }

    // Hidden wrapper for the view settings
    let divAccountTemplateSettingsViewWrapper = document.createElement("div");
    divAccountTemplateSettingsViewWrapper.classList.add("div_account_template_default_settings_view_wrapper");
    divAccountTemplateSettingsViewWrapper.hidden = true;
    divAccountTemplateSettingsListBigWrapper.appendChild(divAccountTemplateSettingsViewWrapper);

    // Add the content in the hidden wrapper
    if(isDefaultSettings){
        for(let category of template.categories){
            // Wrapper for this category
            let divViewSettingsCategoryWrapper = document.createElement("div");
            divViewSettingsCategoryWrapper.classList.add("div_view_settings_category_wrapper");
            divAccountTemplateSettingsViewWrapper.appendChild(divViewSettingsCategoryWrapper);

            // Category title
            let divViewSettingsCategoryTitle = document.createElement("div");
            divViewSettingsCategoryTitle.classList.add("div_view_settings_category_title");
            divViewSettingsCategoryTitle.textContent = category.title;
            divViewSettingsCategoryWrapper.appendChild(divViewSettingsCategoryTitle)

            // Element
            let divViewSettingsElement = document.createElement("div");
            divViewSettingsElement.classList.add("div_view_settings_element");
            divViewSettingsElement.textContent = "Random";
            divViewSettingsCategoryWrapper.appendChild(divViewSettingsElement);
        }
    }else{
        loadSettingsAccount(templateSettings, divAccountTemplateSettingsViewWrapper);
    }

    // Event listener for the view button
    buttonAccountTemplateSettingsView.addEventListener("click", function(){
        if(divAccountTemplateSettingsViewWrapper.hidden){
            buttonAccountTemplateSettingsView.textContent = "Hide";
            divAccountTemplateSettingsViewWrapper.hidden = false;
        }else{
            buttonAccountTemplateSettingsView.textContent = "View";
            divAccountTemplateSettingsViewWrapper.hidden = true;
        }
    });

}

/**
 * Get the settings and add their content to the target HTML object.
 * 
 * @param {*} settings 
 * @param {*} divTarget 
 */

function loadSettingsAccount(settings, divTarget){
    switch(settings.type){

        case "wrapper_category":

            // Create the wrapper, add it to the current target
            let divTemplateSettingViewWrapperCategory = document.createElement("div");
            divTemplateSettingViewWrapperCategory.classList.add("div_template_setting_view_wrapper_category");
            divTarget.appendChild(divTemplateSettingViewWrapperCategory);

            // Loop on the children
            for(child of settings.children){
                loadSettingsAccount(child, divTemplateSettingViewWrapperCategory);
            }

            break;

        case "category":

            // Wrapper for this category
            let divViewSettingsCategoryWrapper = document.createElement("div");
            divViewSettingsCategoryWrapper.classList.add("div_view_settings_category_wrapper");
            divTarget.appendChild(divViewSettingsCategoryWrapper);

            // Category title
            let divViewSettingsCategoryTitle = document.createElement("div");
            divViewSettingsCategoryTitle.classList.add("div_view_settings_category_title");
            divViewSettingsCategoryTitle.textContent = settings.title;
            divViewSettingsCategoryWrapper.appendChild(divViewSettingsCategoryTitle)

            // Element
            let divViewSettingsElement = document.createElement("div");
            divViewSettingsElement.classList.add("div_view_settings_element");
            divViewSettingsCategoryWrapper.appendChild(divViewSettingsElement);

            // Now to read the settings
            switch(settings.category_element_selected){

                case "random_element":
                    divViewSettingsElement.textContent = "Random";
                    break;
                
                case "choose_number":

                    divViewSettingsElement.textContent = "Random number";
                    break;
                
                default:
                    
                    divViewSettingsElement.textContent = settings.category_element_value;

                    break;
            }
            break;

        default:
            // Get to the children
            for(child of settings.children){
                loadSettingsAccount(child, divTarget);
            }
            break;
    }
}
