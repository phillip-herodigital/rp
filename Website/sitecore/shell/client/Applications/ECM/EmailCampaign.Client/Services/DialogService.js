define(['sitecore', 'jquery'], function (sitecore, $) {
  var DialogRenderingTypes = {
      alert: '{6F26F209-5DF3-4BA2-BBEE-D4A76B1010B7}',
      defaultSettings: '{33E6267B-0112-468D-9717-5E8EBFD0ACB9}',
      confirm: '{620AC309-7AAD-4D7E-8AE2-F7163AB0A45F}',
      prompt: '{42245841-8BC6-4879-9E61-06C6DFB5FF43}',
      addAttachment: '{26D93861-13E8-4416-8319-0D03094A19CB}',
      attachments: '{A15BAF11-07C0-494A-B6E5-FFA92085A995}',
      saveAsSubscription: '{2CCFF6B5-3FFA-4B15-AE62-F3A70E9FB48C}',
      previewRecipients: '{C17EAA2B-CEBC-4A9B-8DF4-400F5B2774D0}',
      personalizationToken: '{E20CE5D9-3766-4711-BD25-B0F907E60F7C}',
      createOneTimeMessage: '{C70377E9-BC2A-4685-8766-C845A941B7F9}',
      createSubscriptionMessage: '{2732E19C-8644-48F4-98F1-389FE3F2A968}',
      createTriggeredMessage: '{42B80D20-5148-4291-BA75-ACA39A99592D}',
      addEmptyList: '{BDC2AB0C-9FC6-41F4-B821-214A8F156A91}',
      addFromExistingList: '{BCBFAB6D-15A7-4509-9D55-E570B301355E}',
      selectFolder: '{64D170BF-507C-4D53-BB4F-8FC76F5F2BBC}',
      designImporter: '{710FEC5A-C168-4603-A171-43BC7B602467}',
      pageEditor: '{8B5A7135-0135-4944-A69F-23D9CD388FE6}',
      messageActivateConfirmation: '{AF46BCDC-AAB7-49C0-91D8-FE48D7CDC94A}',
      messageDispatchConfirmation: '{0EAF272C-EF39-4155-A4E1-B8CF8FFF2F46}',
      // TODO: check is this dialog used somewhere
      messageManualWinnerSelectConfirmation: '{125864A1-E4AF-4A6A-87D5-A3534894FE02}'
    },

    insertRendering = _.bind(
      sitecore.Definitions.App.prototype.insertRendering,
      { insertMarkups: sitecore.Definitions.App.prototype.insertMarkups }
    ),

    dialogs = {},

    getCreateDialog = function (type, id) {
      id = id || type;
      var defer = $.Deferred();
      dialogs[type] = dialogs[type] || {};
      if (dialogs[type][id]) {
        defer.resolve(dialogs[type][id]);
      } else {
        if (DialogRenderingTypes[type]) {
          insertRendering(DialogRenderingTypes[type], { $el: $("body") }, function(dialog) {
            if (dialog) {
              dialogs[type][id] = dialog;
              defer.resolve(dialog);
            } else {
              defer.reject();
            }
          });
        } else {
          defer.reject();
        }
      }
      return defer.promise();
    };

  return {
    get: getCreateDialog,
    show: function(type, id, params) {
      if (typeof id === "object" && !params) {
        params = id;
        id = null;
      }
      params = params || {};
      getCreateDialog(type, id)
        .done(function (dialog) {
          dialog.showDialog(params);
        });
    }
  }
});