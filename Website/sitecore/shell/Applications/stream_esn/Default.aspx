<%@ Page Language="C#" AutoEventWireup="true" Inherits="Sitecore.Shell.Web.UI.SecurePage" %>
<%@ Import Namespace="Sitecore" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>
<asp:placeholder id="DocumentType" runat="server" />
<html>
  <head runat="server">
      
      <script type="text/javascript" src="/frontend/assets/js/bundle"></script>
    <script type="text/javascript">if (!window.$sc) $sc = jQuery.noConflict();</script>
    <title></title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <asp:PlaceHolder id="BrowserTitle" runat="server" />
    <sc:Stylesheet runat="server" Src="Content Manager.css" DeviceDependant="true" />
    <sc:Stylesheet runat="server" Src="Ribbon.css" DeviceDependant="true" />
    <asp:PlaceHolder id="Stylesheets" runat="server" />
    <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreObjects.js"></script>
    <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreKeyboard.js"></script>
    <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreVSplitter.js"></script>
    <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreWindow.js"></script>
    <script type="text/JavaScript" src="/sitecore/shell/Applications/Content Manager/Content Editor.js"></script>
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/jQuery/jquery-splitter/jquery-splitter.js"></script>

    <script type="text/JavaScript" src="/sitecore/shell/Applications/Analytics/Personalization/Carousel/jquery.jcarousel.min.js"></script>
    <link href="/sitecore/shell/Applications/Analytics/Personalization/Carousel/skin.css" rel="stylesheet" />
    <script type="text/JavaScript" src="/sitecore/shell/Applications/Analytics/Personalization/Tooltip.js"></script>

    
    <style type="text/css">
      .scRibbonNavigator
      {
        margin-left: 44px;
      }
 
      table {
        border:0;
        border-collapse:collapse; /* cellspacing="0" */
      }

      table td {
        padding:0; /* cellpadding="0" */
      }

      #MainPanel {
        position: relative;
      }

      .ie8 #ContentTreeHolder, .ie9 #ContentTreeHolder, .ie8 #SearchResultHolder, .ie9 #SearchResultHolder, .ie8 #SearchResult, .ie9 #SearchResult {
        position: absolute;
        width: 100%;
        bottom:0;
        top:0;
        margin-top: 29px;
      }

      .ie8 #ContentTreeHolder, .ie8 #SearchResultHolder,.ie8 #SearchResult {
        margin-top: 21px;
      }

      .ie8 #SearchResult > table, .ie8 #SearchResult .filler .scSearchCategory {
        height: auto;
      }

    </style>
    <script type="text/javascript">
      if (scForm) {
        scForm.enableModifiedHandling();
      }
    </script>
  </head>
  <body runat="server" id="Body" class="scWindowBorder1" onmousedown="javascript:scWin.mouseDown(this, event)"
    onmousemove="javascript:scWin.mouseMove(this, event)" onmouseup="javascript:scWin.mouseUp(this, event)">
    <form id="ContentEditorForm" style="overflow:hidden" runat="server">
    <sc:CodeBeside runat="server" Type="Sitecore.Shell.Applications.ContentManager.ContentEditorForm, Sitecore.Client" />
    <sc:DataContext runat="server" ID="ContentEditorDataContext" />
    <sc:RegisterKey runat="server" KeyCode="120" Click="system:publish" />
    <asp:PlaceHolder ID="scLanguage" runat="server" />
    <input type="hidden" id="scActiveRibbonStrip" name="scActiveRibbonStrip" />
    <input type="hidden" id="scEditorTabs" name="scEditorTabs" />
    <input type="hidden" id="scActiveEditorTab" name="scActiveEditorTab" />
    <input type="hidden" id="scPostAction" name="scPostAction" />
    <input type="hidden" id="scShowEditor" name="scShowEditor" />
    <input type="hidden" id="scSections" name="scSections" />
    <div id="outline" class="scOutline" style="display: none">
    </div>
    <span id="scPostActionText" style="display: none">
        <sc:Literal Text="The main window could not be updated due to the current browser security settings. You must click the Refresh button yourself to view the changes."
            runat="server" />
    </span>
    <asp:ScriptManager ID="ScriptManager1" runat="server" />
    <telerik:RadSpell ID="RadSpell" runat="server" Visible="false" />
    <telerik:RadToolTipManager runat="server" ID="ToolTipManager" class="scRadTooltipManager" />
      <iframe id="overlayWindow" src="/sitecore/shell/Controls/Rich Text Editor/EditorWindow.aspx" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; display: none; z-index: 999;border:none" frameborder="0" allowtransparency="allowtransparency"></iframe>
    <a id="SystemMenu" runat="server" href="#" class="scSystemMenu" onclick="javascript:return scForm.postEvent(this, event, 'SystemMenu_Click')"
        ondblclick="javascript:return scForm.invoke('contenteditor:close')"></a>
    <div class="scFlexColumnContainer scWindowBorder2" style="height: 100%" onactivate="javascript:scWin.activate(this, event);">
      <div class="scCaption scWindowHandle scDockTop" ondblclick="javascript:scWin.maximizeWindow();" style="min-height: 1px;">
        <div id="CaptionTopLine">
          <img src="/sitecore/images/blank.gif" width="1" height="1" alt="" /></div>
        <div class="scSystemButtons">
          <asp:PlaceHolder ID="WindowButtonsPlaceholder" runat="server" />
        </div>
        <div id="RibbonPanel" style="min-height: 27px">
          <asp:PlaceHolder ID="RibbonPlaceholder" runat="server" />
        </div>
      </div>
      <div class="scFlexContent" id="MainPanel" ng-app="ngApp" ng-controller="esnActivationUploadController as activationCtrl">
        <div class="scEditorHeaderNavigatorMenu scStretchAbsolute" stream-drop-files="activationCtrl.uploadFile">

            <article class="marketing scStretchAbsolute scEditorHeaderNavigatorMenu" style="margin: 30px; background-color: white; padding: 5px;">
            
                <div class="notice success" ng-if="activationCtrl.uploadSuccess">Succeeded - uploaded {{activationCtrl.lastFileName}}</div>
                <div class="notice error" ng-if="activationCtrl.uploadFailure">Failed - could not upload {{activationCtrl.lastFileName}}</div>

                <div class="notice alert">
                    <p ng-if="!activationCtrl.uploadFile">Drag and drop CSV file here to add activation codes.</p>
                    <p ng-if="activationCtrl.uploadFile">Ready to upload: {{activationCtrl.uploadFile[0].name}}</p>
                </div>
                <button type="button" ng-click="activationCtrl.upload()" ng-disabled="!activationCtrl.uploadFile || activationCtrl.isLoading">Upload</button>

            </article>


        </div>
      </div>
      <asp:PlaceHolder ID="Pager" runat="server" />
      <div class="scWindowBorder3" id="BottomBorder" runat="server"></div>
    </div>
    <sc:KeyMap runat="server" />
    </form>
    <script>
      // Do not move this code to "scContentEditor.prototype.onLoad", because it starts running much faster here.
      var href = window.location.href;
      if ((scForm.getCookie("scContentEditorFolders") != "0") && href.indexOf("mo=preview") < 0 && href.indexOf("mo=mini") < 0 && href.indexOf("mo=popup") < 0
        || href.indexOf("mo=template") >= 0) {

        jQuery('.scContentEditorSplitter').splitter({
          resizeTo: document.getElementById('MainPanel'),
          sizeLeft: scForm.getCookie("scContentEditorFoldersWidth") || 200,
          onEndSplitMouse: function (pos) {
            scForm.setCookie("scContentEditorFoldersWidth", pos);
          }
        });
      }
    </script>
</body>
</html>
