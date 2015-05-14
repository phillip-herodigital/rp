Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {};
Sitecore.ExperienceEditor.TranslationsUtils = {
  keys: {
    // translated alert
    An_error_occured: "An error occured.",
    Could_not_create_item: "Could not create item.",
    
    // translated confirm
    There_are_unsaved_changes: "There are unsaved changes.",
    The_item_has_been_modified: "Do you want to save the changes to the item?",
    
    // translated prompt
    Enter_a_new_name_for_the_item: "Enter a new name for the item:",
    Enter_the_filename_where_to_save_the_profile: "Enter the path and file name to save the profile:",
    Enter_the_filename_where_to_save_the_trace: "Enter the path and file name to save the trace:",

    //Common texts
    Lock: "Lock",
    Unlock: "Unlock",
  },
  
  translateText: function (key) {
    return Sitecore.Speak.Resources.Dictionary[key];
  },
};