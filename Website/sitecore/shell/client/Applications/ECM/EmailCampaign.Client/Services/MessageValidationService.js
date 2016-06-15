define([
  'sitecore',
  "/-/speak/v1/ecm/GlobalValidationService.js"
], function (
  sitecore,
  GlobalValidationService
  ) {
  return {
    validateMessageVariantsSubject: function (variants) {
      /*
       * Validation of message variants should not block message from saving, it only should block message from dispatching
       * That is why needed to validate message variants silently and trigger validation message event manually,
       * to not polute validation model with unnecessary errors. (Legacy behavior)
       */
      for (var index in variants) {
        if (!GlobalValidationService.validate(variants[index].subject, {
          required: { silent: true }
        })) {
          GlobalValidationService.trigger('validation:input:error', {
            id: 'variantSubjectRequired',
            text: sitecore.Resources.Dictionary.translate("ECM.Pages.Message.TheSubjectFieldIsEmpty")
          });
          return false;
        }
      }
      GlobalValidationService.trigger('validation:input:success', { id: 'variantSubjectRequired' });
      return true;
    }
  };
});