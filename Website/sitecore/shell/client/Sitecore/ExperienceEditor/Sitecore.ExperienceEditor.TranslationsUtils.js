Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {};
Sitecore.ExperienceEditor.TranslationsUtils = {
  keys: {
    // translated alert
    An_error_occured: "An error occured.",
    Could_not_create_item: "Could not create item.",
    The_name_cannot_be_blank: "The name cannot be blank.",
    The_item_name_is_not_valid: "The name contains invalid characters.",
    You_cannot_delete_the_page_because_another_user_has_locked_it: "You cannot delete \"{0}\" because another user has locked it.",
    Item_is_locked_by: "The item is locked by <b>{0}</b>.",
    You_do_not_have_permission_to_insert_a_page: "You do not have permission to create a new item here.",
    You_do_not_have_permissions_to_move_this_item_to_the_selected_location: "You do not have permission to move the item to the new location",
    You_do_not_have_permissions_to_rename_this_item: "You do not have permission to rename \"{0}\".",
    Unable_to_save_changes_because_the_corresponding_content_has_been_locked_by_another_user: "Cannot save the item \"{0}\" because it has not been locked by the current user.",
    You_do_not_have_permissions_to_save_this_item: "The new previews will be lost after you close the application. You have no sufficient access rights to save them.",
    You_do_not_have_permission_to_delete_this_page: "You do not have permission to delete \"{0}\".",
    You_can_not_delete_the_home_item: "The operation cannot be applied to the site start item.",
    
    // translated confirm
    There_are_unsaved_changes: "There are unsaved changes.",
    The_item_has_been_modified: "Do you want to save the changes to the item?",
    This_operation_may_take_a_long_time_to_complete_Are_you_sure_you_want_to_continue: "This operation may take a long time to complete.\n\nAre you sure you want to continue?",
    One_or_more_items_have_been_changed_Do_you_want_to_overwrite_these_changes: "One or more items have been changed.\n\nDo you want to overwrite these changes?",
    This_item_also_occurs_in_other_locations_If_you_move_it_it_maybe_deleted_from_the_other_locations_Are_you_sure_you_want_to_move_it: "One or more items also occur in other locations.\nIf you move these items,\nthey maybe deleted from the other locations.\n\nAre you sure you want to move these items?",
    Do_you_really_wish_to_delete_the_page: "Are you sure you want to delete \"{0}\"?",
    This_item_occurs_in_other_locations_If_you_rename_it_the_item_will_be_renamed_in_the_other_locations_as_well_Are_you_sure_you_want_to_rename: "This item occurs in other locations. If you rename it,\nthe item will be renamed in the other locations as well.\n\nAre you sure you want to rename '{0}'?",
    Are_you_sure_you_want_to_reset_the_layout_to_the_settings_defined_in_the_template: "Are you sure you want to reset the layout to the settings defined in the template?",
    
    // translated prompt
    Enter_a_new_name_for_the_item: "Enter a new name for the item:",
    Enter_the_filename_where_to_save_the_profile: "Enter the path and file name to save the profile:",
    Enter_the_filename_where_to_save_the_trace: "Enter the path and file name to save the trace:",

    // untanslated  alert
    The_item_is_readonly: "The item is readonly",
    You_cannot_modify_the_lock_state_of_this_item: "You cannot modify the lock state of this item",
    Select_an_item: "Select an item.",

    //Common texts
    Lock: "Lock",
    Unlock: "Unlock",
  },
  
  translateText: function (key) {
    return Sitecore.Speak.Resources.Dictionary[key];
  },
};