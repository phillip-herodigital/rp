InsertToken = new function() {
  this.LastFocusedEdit = "";
  this.Parent = null;
  this.SelectionStart = 0;
  this.SelectionEnd = 0;
  this.TokenList = [];
  this.Init = function (parentId) {
    this.Parent = $("#" + parentId);
    var self = this;
    this.Parent.find('input,textarea').each(function (index) {
      $(this).focus(function () {
        self.LastFocusedEdit = $(this).attr("id");
      });
      $(this).focusout(function () {
        var elem = document.getElementById($(this).attr("id"));
        self.SelectionStart = elem.selectionStart;
        self.SelectionEnd = elem.selectionEnd;
      });
    });
  };
  this.PasteText = function (text, message) {
    if (this.LastFocusedEdit == "" || text == "" || text == '$undefined$') {
      if (message) {
        alert(message);
      }
      return;
    }
    var obj = $("#" + this.LastFocusedEdit);
    var value = obj.val().substring(0, this.SelectionStart) + text + obj.val().substring(this.SelectionEnd);
    obj.val(value);
    setTimeout(function(){obj.next().focus();}, 300);
  };
  this.ReplaceTokens = function (isReadOnly) {
      var self = this;
      var fEditor = $('.abnmessagetest fieldset div.ui-accordion-content div fieldset div div.field-editor');
      var subjectList = isReadOnly
          ? $('div.editor-ro-fieldreadtemplate:first', fEditor)
          : $('input:text[id*="_Subject_"]', fEditor);
      if (subjectList.length === 0) {
          setTimeout(function () { self.ReplaceTokens(isReadOnly); }, 500);
          return;
      }
      $.each(subjectList, function (i) {
          var subjectInput = $(this);
          if (isReadOnly) {
              subjectInput.text(replaceToken(subjectInput.text(), self.TokenList));
          } else {
              if (!$(this).next().is('input[id*="replaceTokensInput_"]')) {
                  $(this).after('<input type="text" id="replaceTokensInput_' + i + '" value="' + replaceToken(subjectInput.val(), self.TokenList) + '" style="display:none" />');
              }
              var replaceTokensInput = $(this).next();
              replaceTokensInput.focus(function() {
                  replaceTokensInput.hide();
                  subjectInput.show().focus();
              });
              subjectInput.blur(function() {
                  subjectInput.hide();
                  replaceTokensInput.show();
                  replaceTokensInput.val(replaceToken(subjectInput.val(), self.TokenList));
              });
          }
      });
      if (!isReadOnly) {
          subjectList.hide();
          $('input:text[id*="replaceTokensInput_"]', fEditor).show();
      }
  }
  function replaceToken(inputValue, tokenList) {
      $.each(tokenList, function (i, item) {
          var find = item.token.replace(/\$/g, '\\$');
          inputValue = inputValue.replace(new RegExp(find, 'g'), item.value);
      });
      return inputValue;
  }
}
