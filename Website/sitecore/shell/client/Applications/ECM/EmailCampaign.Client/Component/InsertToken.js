InsertToken = new function () {
  this.LastFocusedEdit = -1;
  this.Parent = null;
  this.ControlForTokenList = null;
  this.SelectionStart = 0;
  this.SelectionEnd = 0;
  this.TokenList = [];

  this.Init = function (parentId, isReadOnly, contactId) {
    if (isReadOnly) { return; }
    var tokenlist;
    postServerRequest("ecm.datasource.personalization.tokens", { managerRootId: sessionStorage.managerRootId, contactId: contactId }, function (response) {
      if (response.error) {
        alert(response.errorMessage);
        return;
      }
      if (response.comboBoxList != null) {
        tokenlist = response.comboBoxList;
      }
    }, false);
    this.TokenList = tokenlist;
    this.Parent = $("div[data-sc-id='" + parentId + "']");
    var self = this;
    this.ControlForTokenList = this.Parent.find("input:text[data-sc-id=SubjectTextBox], textarea[data-sc-id=AlternativeTextArea]");
    this.ControlForTokenList.each(function (index) {
      var currrent = $(this);
      currrent.attr("id", "withTokens_" + index);
      currrent.focus(function () { self.LastFocusedEdit = this.id; });
      currrent.focusout(function () {
        self.SelectionStart = this.selectionStart;
        self.SelectionEnd = this.selectionEnd;
      });
    });
    this.ReplaceTokens(isReadOnly);
  };

  this.PasteText = function (text, message) {
    var obj = $("#" + this.LastFocusedEdit);
    if (this.LastFocusedEdit == "" || text == "" || text == '$undefined$' || obj.length == 0) {
      if (message) {
        alert(message);
      }
      return;
    }
    
    var value = obj.val().substring(0, this.SelectionStart) + text + obj.val().substring(this.SelectionEnd);
    obj.val(value).trigger("change");
    setTimeout(function () { obj.next().focus(); }, 300);
  };

  this.ReplaceTokens = function (isReadOnly) {
    var self = this;
    var fEditor = $('div[data-sc-id=MessageVariantAccordion]');
    var subjectList = isReadOnly
      ? $('div.editor-ro-fieldreadtemplate:first', fEditor)  //TODO: please implement read only state
      : this.ControlForTokenList;
    if (subjectList.length === 0) {
      setTimeout(function () { self.ReplaceTokens(isReadOnly); }, 500);
      return;
    }

    $.each(subjectList, function (i) {
      var subjectInput = $(this);
      if (isReadOnly) {
        subjectInput.text(replaceToken(subjectInput.text(), self.TokenList));
        return;
      }
      if (!$(this).next().is('[id*="replaceTokensInput_"]')) {
        $(this).clone(true).insertAfter(this)
            .attr('id', 'replaceTokensInput_' + i)
            .attr('value', replaceToken(subjectInput.val(), self.TokenList))
            .removeAttr('data-sc-id').removeAttr('data-bind').removeAttr('data-sc-require')
            .removeAttr('placeholder')
            .css('display', 'none');
      }
      
      var replaceTokensInput = $(this).next();
      replaceTokensInput.focus(function () {
        showSubjectInput(subjectInput, replaceTokensInput);
      });

      subjectInput.blur(function () {
        showReplaceTokensInput(subjectInput, replaceTokensInput, self.TokenList);
      });

      showReplaceTokensInput(subjectInput, replaceTokensInput, self.TokenList);
    });

    if (!isReadOnly) {
      subjectList.hide();
      $('[id*="replaceTokensInput_"]', fEditor).show();
    }
  };

  function showSubjectInput(subjectInput, replaceTokensInput) {
    if (!subjectInput || !replaceTokensInput) {
      return;
    }

    replaceTokensInput.hide();
    subjectInput.show().focus();
  }

  function showReplaceTokensInput(subjectInput, replaceTokensInput, tokenList) {
    if (!subjectInput || !replaceTokensInput || !tokenList) {
      return;
    }

    subjectInput.hide();
    replaceTokensInput.show();
    replaceTokensInput.val(replaceToken(subjectInput.val(), tokenList));
  }

  function replaceToken(inputValue, tokenList) {
    $.each(tokenList, function (i, item) {
      var find = item.id.replace(/\$/g, '\\$');
      inputValue = inputValue.replace(new RegExp(find, 'g'), item.name);
    });
    return inputValue;
  }

  this.GetDialog = function (sitecore, contextApp) {
    if (contextApp["personalizationTokenDialog"] === undefined) {
      contextApp.insertRendering("{E20CE5D9-3766-4711-BD25-B0F907E60F7C}", { $el: $("body") }, function(subApp) {
        contextApp["personalizationTokenDialog"] = subApp;
        personalizationTokenDialogShow();
      });
    } else {
      personalizationTokenDialogShow();
    }

    function personalizationTokenDialogShow() {
      sitecore.trigger("personalization:token:dialog:show");
    }
  };
};