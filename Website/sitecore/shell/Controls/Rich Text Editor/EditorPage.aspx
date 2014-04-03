<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EditorPage.aspx.cs" Inherits="Sitecore.Shell.Controls.RichTextEditor.EditorPage" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls.Ribbons" TagPrefix="sc" %>
<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="overflow:hidden; width: 100%; height: 100%">
  <meta http-equiv="X-UA-Compatible" content="IE=5"/>
  <head runat="server">
    <title>Sitecore</title>
    <link href="/sitecore/shell/Themes/Standard/Firefox/Content Manager.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
      <asp:Placeholder ID="EditorStyles" runat="server" />

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
          overflow-y: auto;
      }
      
      #EditorWrapper {
          height: 100% !important;
      }
   
    </style>
    
    <script src="/sitecore/shell/controls/lib/prototype/prototype.js" type="text/javascript"></script>
    <script type="text/javascript" language="javascript" src="/sitecore/shell/Controls/Rich Text Editor/EditorPage.js"></script>
    <script type="text/javascript" language="javascript" src="/sitecore/shell/Controls/Rich Text Editor/RTEfixes.js"></script>
  
    <script type="text/javascript" language="javascript">
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
        scRichText.onClientLoad(editor);

        var filter = new WebControlFilter()
        editor.get_filtersManager().add(filter);

        var protoFilter = new PrototypeAwayFilter();
        editor.get_filtersManager().add(protoFilter);

        setTimeout(function() {
          var filterManager = editor.get_filtersManager();
          var myFilter = filterManager.getFilterByName("Sitecore WebControl filter");

          myFilter.getDesignContent(editor.get_contentArea());

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

        scForm.postRequest("", "", "", command);

        scForm.browser.clearEvent(evt);

        return false;
      }

      function OnClientInit(editor) {
        if (!Prototype.Browser.IE) {
          var element = editor.get_element();
          editor.add_firstShow(function () { element.style.minWidth = element.style.width; });
        }
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

          DocumentManager-UploadPaths="/"
          DocumentManager-DeletePaths="/"
          DocumentManager-ViewPaths="/"

          TemplateManager-UploadPaths="/media library"
          TemplateManager-DeletePaths="/media library"
          TemplateManager-ViewPaths="/media library"

          ThumbSuffix="thumb"
          
          OnClientLoad="OnClientLoad"
          OnClientSelectionChange="OnClientSelectionChange"
          OnClientInit="OnClientInit"
          OnClientPasteHtml="OnClientPasteHtml" />
        
        </ContentTemplate>
      </asp:UpdatePanel>      
      
      <script type="text/javascript" language="javascript" src="/sitecore/shell/Controls/Rich Text Editor/RichText Commands.js"></script>
      
      <asp:placeholder id="EditorClientScripts" runat="server"/>
      
      <div id="scButtons" style="position: absolute; right: 8px; bottom: 1px">
        <sc:Button runat="server" ID="OkButton" Width="76px" Height="23px" KeyCode="13" Margin="0px 0px 0px 4px" Click="javascript: if (Prototype.Browser.IE){ $$(\'.reMode_design\')[0].click(); } scSendRequest(event, \'editorpage:accept\')" Type="Button">
          <sc:Literal runat="server" Text="Accept"/>
        </sc:Button>

        <sc:Button runat="server" ID="CancelButton" Width="76px" Height="23px" KeyCode="27" Margin="0px 0px 0px 4px" Click="javascript:scSendRequest(event, \'editorpage:reject\')" Type="Button">
          <sc:Literal runat="server" Text="Reject"/>
        </sc:Button>
      </div>
    </form>
  </body>
</html>