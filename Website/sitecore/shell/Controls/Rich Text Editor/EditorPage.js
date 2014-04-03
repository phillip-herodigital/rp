if (typeof (Sitecore) == "undefined") Sitecore = new Object();
if (typeof (Sitecore.Controls) == "undefined") Sitecore.Controls = new Object();

Sitecore.Controls.RichEditor = Class.create({
  initialize: function(editorId) {
    this.editorId = editorId;
  },

  onClientLoad: function(editor) {
    editor.attachEventHandler("onkeydown", this.onKeyDown.bind(this));
    if (!scForm.browser.isIE) {
      this.getEditor().get_element().style.minHeight = '';
    }

    fixIeObjectTagBug();
    Event.observe($$('.reMode_design')[0], 'click', function () {
      setTimeout(fixIeObjectTagBug, 100);
    });

    if (Prototype.Browser.IE && editor.get_newLineMode() == Telerik.Web.UI.EditorNewLineModes.P) {
      editor.attachEventHandler("onkeydown", function (e) {
        if (e.keyCode == 13) {
          var oCmd = new Telerik.Web.UI.Editor.GenericCommand("Enter", editor.get_contentWindow(), editor);
          editor.executeCommand(oCmd);
        }
      });
    }

    this.oldValue = editor.get_html(true);
  },

  getEditor: function() {
    if (typeof ($find) == "function") {
      return $find(this.editorId);
    }

    return null;
  },

  saveRichText: function (html) {
    var w = scForm.browser.getParentWindow(window.frameElement.ownerDocument);
    if (w.frameElement) {
      w = scForm.browser.getParentWindow(w.frameElement.ownerDocument);
    }

    w.scContent.saveRichText(html);
  },

  setFocus: function() {
    var editor = this.getEditor();
    if (!editor) {
      return;
    }

    editor.setFocus();
  },

  setText: function(html) {
    var editor = this.getEditor();
    if (!editor) {
      return;
    }

    editor.set_html(html);
    fixIeObjectTagBug();
  },

  onKeyDown: function(evt) {
    var editor = this.getEditor();

    if (editor == null || evt == null) {
      return;
    }

    if (evt.ctrlKey && evt.keyCode == 13) {
      scSendRequest("editorpage:accept");
      return;
    }

    if (!scForm.isFunctionKey(evt, true)) {
      scForm.setModified(true);
    }
  }
});

function scCloseEditor() {
   var doc = window.top.document;
   
   // Field editor
   var w = doc.getElementById('feRTEContainer');

   if (w) {        
    $(w).hide();
   }
   else {
    // Page editor
    window.close();
  }
}