define(["sitecore"]);

function nameIsValid(name, messageBar, sitecore) {
  if (!messageBar) { return false; }

  var validateNameMessage = createErrorMessage("validateNameMessage", sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.NameRequired"));
  var result = isRequired(name, validateNameMessage, messageBar);
  if (!result) { return result; }

  validateNameMessage = createErrorMessage("validateNameMessage", sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.NameTrimRequired"));
  result = isTrimRequired(name, validateNameMessage, messageBar);
  if (!result) { return result; }

  var validateMaxNameLengthMessage = createErrorMessage("validateMaxNameLengthMessage", sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.NameMaxLength"));
  return maxLengthIsValid(name, 100, validateMaxNameLengthMessage, messageBar);
}

function fromEmailIsValid(email, fromName, messageBar, sitecore) {
  if (!messageBar) { return false; }
  var fromEmailMessage = createErrorMessage("fromEmailMessage", sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FromEmailRequired"));
  var result = isRequired(email, fromEmailMessage, messageBar);
  if (!result) { return result; }
  var fromEmailNotValidMessage = createErrorMessage("fromEmailNotValidMessage", sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FromEmailNotValid"));
  result = emailIsValid(email, fromEmailNotValidMessage, messageBar);
  if (!result) { return result; }
  return fromNameAndFromEmailLenghtIsValid(fromName, email, messageBar, sitecore);
}

function fromNameIsValid(fromName, fromEmail, messageBar, sitecore) {
  if (!messageBar) { return false; }
  return fromNameAndFromEmailLenghtIsValid(fromName, fromEmail, messageBar, sitecore);
}

function replyToTextBoxIsValid(text, messageBar, sitecore) {
  if (!messageBar) { return false; }
  var replyToNotValidMessage = createErrorMessage("replyToNotValidMessage", sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.ReplyToEmailNotValid"));
  if (text == "") {
    messageBar.removeMessage(function (error) { return error.id === replyToNotValidMessage.id; });
    return true;
  }


  return emailIsValid(text, replyToNotValidMessage, messageBar);
}

function isRequired(content, messagetoAdd, messageBar) {
  messageBar.removeMessage(function (error) { return error.id === messagetoAdd.id; });
  if (!content || content == "") {
    messageBar.addMessage("error", messagetoAdd);
    return false;
  }
  return true;
}
function isTrimRequired(content, messagetoAdd, messageBar) {
  messageBar.removeMessage(function (error) { return error.id === messagetoAdd.id; });
  if (!content || content.trim() == "") {
    messageBar.addMessage("error", messagetoAdd);
    return false;
  }
  return true;
}
function maxLengthIsValid(content, maxLength, messagetoAdd, messageBar) {
  messageBar.removeMessage(function (error) { return error.id === messagetoAdd.id; });
  if (content.length > maxLength) {
    messageBar.addMessage("error", messagetoAdd);
    return false;
  }
  return true;
}
function emailIsValid(email, messagetoAdd, messageBar) {
  messageBar.removeMessage(function (error) { return error.id === messagetoAdd.id; });
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test(email)) {
    return true;
  }
  messageBar.addMessage("error", messagetoAdd);
  return false;
}
function urlIsValid(textval, messagetoAdd, messageBar) {
  messageBar.removeMessage(function (error) { return error.id === messagetoAdd.id; });
  var filter = /^(http|https){1}\:\/\/(([a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]?)\.)*([a-zA-Z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?)(:\d{2,5})?(\/[a-zA-Z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?)*(\/{1})?$/;
  if (filter.test(textval)) {
    return true;
  }
  messageBar.addMessage("error", messagetoAdd);
  return false;
}
function fromNameAndFromEmailLenghtIsValid(fromName, fromEmail, messageBar, sitecore) {
  var toLongMessage = createErrorMessage("toLongMessage", sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FromNamePlusFromAddressIsToLong"));
  messageBar.removeMessage(function (error) { return error.id === toLongMessage.id; });
  if (fromName.length + fromEmail.length > 254) {
    messageBar.addMessage("error", toLongMessage);
    return false;
  }
  return true;
}
function createErrorMessage(id, text) {
  return {
    id: id,
    text: text,
    actions: [],
    closable: false
  };
}
function validation_checkIsModify(messageContext, messageBar) {
  if (messageBar.get("errors").length > 0) {
    messageContext.set("isModified", false);
  }
}