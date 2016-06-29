define(['sitecore'], function (sitecore) {
  function objectToHaveKeys(obj, keys) {
    for (key in keys) {
      if (!key in obj) {
        return false;
      }
    }
    return true;
  };

  function MessageCreationService () {};

  _.extend(MessageCreationService.prototype, {
    messageDataValidators: {
      new: [
        'messageTemplateId',
        'managerRootId',
        'messageName',
        'messageTypeTemplateId'
      ],
      importHtml: [
        'messageTemplateId',
        'managerRootId',
        'messageName',
        'messageTypeTemplateId',
        'fileItemId',
        'fileName',
        'database'
      ],
      existingPage: [
        'messageTemplateId',
        'managerRootId',
        'messageName',
        'messageTypeTemplateId',
        'existingPagePath', 
        'databaseName'
      ],
      importedDesign: [
        'importFolderId',
        'managerRootId',
        'messageTypeTemplateId'
      ]
    },

    prepareData: function(data, language) {
      return _.extend({
        language: language,
        errorCount: 0
      }, data);
    },

    create: function(type, messageData, language, options) {
      if (!this.validateMessageData(type, messageData)) {
        return false;
      }

      var data = this.prepareData(messageData, language);
      switch(type) {
        case 'new':
          this.newMessage(data);
          break;
        case 'importHtml':
          sitecore.Pipelines.ImportNewHtmlLayout.execute({ currentContext: data });
          if (data.errorCount > 0) {
            return false;
          }
          this.newMessage(data);
          break;
        case 'existingPage':
          sitecore.Pipelines.AddPreExistingPage.execute({
            currentContext: data,
            onError: options.on.error
          });
          break;
        case 'importedDesign':
          sitecore.Pipelines.ImportNewDesign.execute({ currentContext: data });
          messageData.itemPath = data.itemPath;
          messageData.messageTemplateId = data.messageTemplateId;
          break;
      }

      if (data.errorCount > 0) {
        return false;
      }

      messageData.newMessageId = data.newMessageId;
      return true;
    },

    newMessage: function(data) {
      sitecore.Pipelines.CreateNewMessage.execute({ currentContext: data });
    },

    validateMessageData: function(type, data) {
      return objectToHaveKeys(data, this.messageDataValidators[type]);
    }
  });

  return new MessageCreationService();
});