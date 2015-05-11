<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EditorPage.aspx.cs" Inherits="Sitecore.Shell.Controls.RichTextEditor.EditorPage" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls.Ribbons" TagPrefix="sc" %>
<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>

<!DOCTYPE html>
<html style="overflow:hidden; width: 100%; height: 100%">
  <head runat="server">
    <title>Sitecore</title>
    <link href="/sitecore/shell/Themes/Standard/Default/Content Manager.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
      <asp:Placeholder ID="EditorStyles" runat="server" />

      body {
        overflow: hidden;
      }

      .reResizeCell
      {
      	display: none;
      }     

      button.scButton
      {
        white-space: nowrap;
        width: 85px;
      }
            
      #EditorUpdatePanel {
          height: 100%;
          width: 100%;
      }
      
      #Editor {
          height: 100% !important;
          overflow-y: hidden;
          min-width: 1100px !important;
      }
      
      #EditorWrapper {
          height: 100% !important;
      }

      .RadWindow .rwTable {
          height: 100% !important;
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
        if (!Prototype.Browser.IE) {
          var element = editor.get_element();
          editor.add_firstShow(function () { element.style.minWidth = element.style.width; });
        }
      }

      function OnClientModeChange(editor, args) {
        setTimeout(function () { scRichText.fitEditorToScreen(); }, 0);
      }
    </script>
  </head>
  
  <body style="height: 100%; width: 100%;background:#ececec">
    <form runat="server" id="mainForm" style="width:100%; height: 100%">
      <sc:AjaxScriptManager runat="server"/>
      <sc:ContinuationManager runat="server" />
      <telerik:RadScriptManager ID="ScriptManager1" runat="server" />

      <input type="hidden" id="EditorValue" />
    
      <asp:UpdatePanel ID="EditorUpdatePanel" runat="server">
        <ContentTemplate>
        <telerik:RadFormDecorator ID="formDecorator" runat="server" DecoratedControls="All" />
        <telerik:RadEditor ID="Editor" Runat="server"
          CssClass="scRadEditor"
          Width="100%"
          ContentFilters="DefaultFilters"
          StripFormattingOptions="MSWordRemoveAll,ConvertWordLists" 
          StripFormattingOnPaste="MSWordRemoveAll,ConvertWordLists"
          LocalizationPath="~/sitecore/shell/controls/rich text editor/Localization/"
          Skin="Default"
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
      
      <script type="text/javascript" language="javascript" src="/sitecore/shell/Controls/Rich Text Editor/RichText Commands.js"></script>
      
      <asp:placeholder id="EditorClientScripts" runat="server"/>
      
      <div id="scButtons" style="position: absolute; right: 8px; bottom: 1px">
        <sc:Button runat="server" ID="OkButton" Width="76px" Height="23px" KeyCode="13" Margin="0px 0px 0px 4px" Click="javascript: if (Prototype.Browser.IE){ var designModeBtn = $$(\'.reMode_design\')[0]; if (typeof (designModeBtn) != \'undefined\') { designModeBtn.click(); } } scSendRequest(event, \'editorpage:accept\')" Type="Button">
          <sc:Literal runat="server" Text="Accept"/>
        </sc:Button>

        <sc:Button runat="server" ID="CancelButton" Width="76px" Height="23px" KeyCode="27" Margin="0px 0px 0px 4px" Click="javascript:scSendRequest(event, \'editorpage:reject\')" Type="Button">
          <sc:Literal runat="server" Text="Reject"/>
        </sc:Button>
      </div>
    </form>
  </body>
</html>