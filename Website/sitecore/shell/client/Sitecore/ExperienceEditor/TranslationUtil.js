define(["sitecore"], function (Sitecore) {
  var translationUtils = {
    keys: {
      // translated alert
      An_error_occured: "An error occured.",
      Could_not_create_item: "Could not create item.",

      // translated confirm
      There_are_unsaved_changes: "There are unsaved changes.",
      The_item_has_been_modified: "Do you want to save the changes to the item?",
      This_version_does_not_have_a_layout_assigned_Do_you_want_to_open_the_version: "This version does not have a layout assigned. Do you want to open the version?", // Server
      Are_you_sure_you_want_to_reset_the_shared_layout_These_changes_will_affect_all_versions_of_this_page: "Are you sure you want to reset the shared layout? These changes will affect all versions of this page.", // Server

      // translated prompt
      Enter_a_new_name_for_the_item: "Enter a new name for the item:",
      Enter_a_new_display_name_for_the_item: "Enter a new display name for the item:",
      Enter_the_filename_where_to_save_the_profile: "Enter the path and file name to save the profile:",
      Enter_the_filename_where_to_save_the_trace: "Enter the path and file name to save the trace:",

      //Common texts
      Lock: "Lock",
      Lock_and_edit: "Lock and Edit",
      Unlock: "Unlock",
      You_must_lock_this_item_before_you_can_edit_it: "You must lock this item before you can edit it."
    },

    translateText: function (key) {
      return Sitecore.Resources.Dictionary[key];
    },

    translateTextByServer: function (key) {
      var result;

      Sitecore.ExperienceEditor.Context.instance.currentContext.value = key;
      Sitecore.ExperienceEditor.Context.instance.postServerRequest("ExperienceEditor.TranslateText", Sitecore.ExperienceEditor.Context.instance.currentContext, function (response) {
        if (!response.error) {
          result = response.value || response.responseValue.value;
        } else {
          Sitecore.ExperienceEditor.Context.instance.handleResponseErrorMessage(response);
        }
      });

      return result;
    },
  };

  return translationUtils;
});