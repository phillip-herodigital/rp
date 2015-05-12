﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EditorPage.aspx.cs" Inherits="Sitecore.Shell.Controls.RichTextEditor.EditorPage" %>

<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>

<!DOCTYPE html>
<html style="overflow: hidden; width: 100%; height: 100%">
<head runat="server">
  <title>Sitecore</title>
  <link href="/sitecore/shell/Themes/Standard/Default/Content Manager.css" rel="stylesheet" type="text/css" />
  <link href="/sitecore/shell/Themes/Standard/Default/Dialogs.css" rel="stylesheet" type="text/css" />
  <style type="text/css">
    <asp:Placeholder ID="EditorStyles" runat="server" />

    textarea {
      outline: none;
    }
  </style>

  <script src="/sitecore/shell/controls/lib/jquery/jquery.noconflict.js" type="text/javascript"></script>
  <script src="/sitecore/shell/controls/lib/prototype/prototype.js" type="text/javascript"></script>
  <script type="text/javascript" src="/sitecore/shell/Controls/Rich Text Editor/EditorPage.js"></script>
  <script type="text/javascript" src="/sitecore/shell/Controls/Rich Text Editor/RTEfixes.js"></script>

  <script type="text/javascript">
    <asp:Placeholder runat="server" ID="ScriptConstants" />

    var scRichText = new Sitecore.Controls.RichEditor(scClientID);
    var currentKey = null;      

    function scLoad(key, html) {
      if (key == currentKey) {
        scRichText.setText(html);
        scRichText.setFocus();
        return;
      }

      currentKey = key;
    }

    function OnClientLoad(editor) {
      editor.attachEventHandler("mouseup", function() {
        var element = editor.getSelection().getParentElement();
        if (element !== undefined && element.tagName.toUpperCase() === "IMG") {
          fixImageParameters(element, prefixes.split("|"));
        }
      });

      scRichText.onClientLoad(editor);

      var filter = new WebControlFilter();
      editor.get_filtersManager().add(filter);

      var protoFilter = new PrototypeAwayFilter();
      editor.get_filtersManager().add(protoFilter);

      var imageFilter = new ImageSourceFilter();
      editor.get_filtersManager().add(imageFilter);

      setTimeout(function() {
        var filterManager = editor.get_filtersManager();
        var myFilter = filterManager.getFilterByName("Sitecore WebControl filter");
        var myImageFilter = filterManager.getFilterByName("Sitecore ImageSourceFilter filter");

        myFilter.getDesignContent(editor.get_contentArea());
        myImageFilter.getDesignContent(editor.get_contentArea());

        editor.fire("ToggleTableBorder");
        editor.fire("ToggleTableBorder");

        editor.setFocus();
      }, 0);
    }

    function scSendRequest(evt, command)
    {
      var editor = scRichText.getEditor();
      if (editor.get_mode() == 2){//If in HTML edit mode
        editor.set_mode(1); //Set mode to Design
      }

      $("EditorValue").value = editor.get_html(true);

      scForm.browser.clearEvent(evt);
        
      scForm.postRequest("", "", "", command);

      return false;
    }

    function OnClientInit(editor) {
    }

    function OnClientModeChange(editor, args) {
      scFitEditor();
    }

    function scFitEditor() {
      var designIframe = document.getElementById('Editor_contentIframe');
      var designMode = designIframe.style.height != '0px'; 
      if (designMode) {
        designIframe.style.height = "0";
      }

      var htmlIframe = document.querySelector('#Editor_contentIframe + iframe');
      htmlIframe && (htmlIframe.style.height = "0");
      setTimeout(function () {
        var clientHeight = document.getElementById('EditorCenter').clientHeight  + 'px';

        if (designMode) {
          designIframe.style.height = clientHeight;
        }

        htmlIframe && (htmlIframe.style.height = clientHeight);

      }, 0);
    }

    Event.observe(window, "resize", scFitEditor);
  </script>
</head>

<body class="scStretch">
  <form runat="server" id="mainForm" class="scStretch">
    <sc:AjaxScriptManager runat="server" />
    <sc:ContinuationManager runat="server" />
    <telerik:RadScriptManager ID="ScriptManager1" runat="server" />

    <input type="hidden" id="EditorValue" />

    <div class="scStretch scFlexColumnContainer">

      <div class="scFlexContent">
        <div class="scStretchAbsolute scDialogContentContainer">

          <asp:UpdatePanel ID="EditorUpdatePanel" class="scStretch" runat="server">
            <ContentTemplate>
              <telerik:RadFormDecorator ID="formDecorator" runat="server" DecoratedControls="All" />
              <telerik:RadEditor ID="Editor" runat="server"
                CssClass="scRadEditor"
                Width="100%"
                ContentFilters="DefaultFilters"
                DialogsCssFile="/sitecore/shell/themes/standard/default/Content Manager.css"
                StripFormattingOptions="MSWordRemoveAll,ConvertWordLists"
                StripFormattingOnPaste="MSWordRemoveAll,ConvertWordLists"
                LocalizationPath="~/sitecore/shell/controls/rich text editor/Localization/"
                Skin="Metro"
                ToolsFile="~/sitecore/shell/Controls/Rich Text Editor/ToolsFile.xml"
                ImageManager-UploadPaths="/media library"
                ImageManager-DeletePaths="/media library"
                ImageManager-ViewPaths="/media library"
                FlashManager-UploadPaths="/media library"
                FlashManager-DeletePaths="/media library"
                FlashManager-ViewPaths="/media library"
                MediaManager-UploadPaths="/media library"
                MediaManager-DeletePaths="/media library"
                MediaManager-ViewPaths="/media library"
                DocumentManager-DeletePaths="/"
                DocumentManager-ViewPaths="/"
                TemplateManager-UploadPaths="/media library"
                TemplateManager-DeletePaths="/media library"
                TemplateManager-ViewPaths="/media library"
                ThumbSuffix="thumb"
                OnClientCommandExecuted="OnClientCommandExecuted"
                OnClientLoad="OnClientLoad"
                OnClientSelectionChange="OnClientSelectionChange"
                OnClientInit="OnClientInit"
                OnClientModeChange="OnClientModeChange"
                OnClientPasteHtml="OnClientPasteHtml" />

            </ContentTemplate>
          </asp:UpdatePanel>
        </div>
      </div>
      <script type="text/javascript" src="/sitecore/shell/Controls/Rich Text Editor/RichText Commands.js"></script>

      <asp:PlaceHolder ID="EditorClientScripts" runat="server" />


      <div id="scButtons" class="scFormDialogFooter">
        <div class="footerOkCancel">
          <sc:Button Class="scButton scButtonPrimary" Click="javascript: if (Prototype.Browser.IE) { var designModeBtn = $$(\'.reMode_design\')[0]; designModeBtn && designModeBtn.click(); } scSendRequest(event, \'editorpage:accept\');" ID="OkButton" KeyCode="13" runat="server">
            <sc:Literal runat="server" Text="Accept" />
          </sc:Button>

          <sc:Button Click="javascript:scSendRequest(event, \'editorpage:reject\')" ID="CancelButton" KeyCode="27" runat="server">
            <sc:Literal runat="server" Text="Reject" />
          </sc:Button>
        </div>
      </div>
    </div>
  </form>
</body>
</html>
