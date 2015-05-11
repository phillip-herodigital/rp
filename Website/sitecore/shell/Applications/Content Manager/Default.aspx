<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Sitecore.Shell.Applications.ContentManager.ContentEditorPage" %>
<%@ Import Namespace="Sitecore" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>
<asp:placeholder id="DocumentType" runat="server" />
<html>
  <head runat="server">
    <script type="text/JavaScript" src="/sitecore/shell/Controls/Lib/jQuery/jquery-1.10.2.min.js"></script>
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
    <script type="text/JavaScript" src="/sitecore/shell/Applications/Content Manager/Content Editor.Search.js"></script>
    <script type="text/JavaScript" src="/sitecore/shell/controls/TreeviewEx/TreeviewEx.js"></script>
    <script type="text/JavaScript" src="/sitecore/shell/Controls/Lib/Scriptaculous/Scriptaculous.js"></script>
    <script type="text/JavaScript" src="/sitecore/shell/Controls/Lib/Scriptaculous/Effects.js"></script>
    <script type="text/JavaScript" src="/sitecore/shell/Controls/Lib/Scriptaculous/DragDrop.js"></script>
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
    <telerik:RadSpell ID="RadSpell" runat="server" />
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
        <div id="RibbonPanel" onclick="javascript:scContent.onEditorClick(this, event);">
          <asp:PlaceHolder ID="RibbonPlaceholder" runat="server" />
        </div>
      </div>
      <div class="scFlexContent" id="MainPanel" onclick="javascript:scContent.onEditorClick(this, event);">
        <div class="scStretchAbsolute scContentEditorSplitter">
          <div id="ContentTreePanel">
            <div class="scFlexColumnContainerWithoutFlexie" style="height: 100%;width: 100%;position: relative" >
              <div id="SearchPanel" style="background: #e9e9e9; border-bottom: 1px solid #4c4c4c">
                <table width="100%">
                  <tr>
                    <td style="width: 100%; overflow: hidden; padding: 1px 0 1px 2px" runat="server">
                      <input id="TreeSearch" class="scSearchInput scIgnoreModified" style="color: #999999"
                              value="<%= Translate.Text(Texts.SEARCH) %>" onkeydown="javascript:if(event.keyCode==13){var result = scForm.postEvent(this,event,'TreeSearch_Click',true);scContent.fixSearchPanelLayout();return result;}"
                              onfocus="javascript:scContent.watermarkFocus(this,event);" onblur="javascript:scContent.watermarkBlur(this,event);" />
                    </td>
                    <td style="padding: 0 0 0 0">
                      <a href="#" class="scSearchButton" onclick="javascript:var result = scForm.postEvent(this,event,'TreeSearch_Click',true);scContent.fixSearchPanelLayout();return result;">
                        <sc:ThemedImage runat="server" Src="Applications/16x16/view.png" Width="16" Height="16"
                                        Margin="0px 1px 0px 1px" />
                      </a>
                    </td>
                    <td style="padding: 0 2px 0 0">
                      <a href="#" class="scSearchOptionsButton" onclick="javascript:Element.toggle('TreeSearchOptions');scContent.fixSearchPanelLayout(); if (typeof(scGeckoRelayout) != 'undefined') scGeckoRelayout();">
                        <sc:ThemedImage runat="server" Src="Images/Down.png" Width="16" Height="16" Margin="0px 1px 0px 1px" />
                      </a>
                    </td>
                  </tr>
                </table>
                <table id="TreeSearchOptions" width="100%" style="display: none; table-layout: fixed; padding: 4px 2px 2px 2px; border-top: 1px solid #414851">
                  <tr>
                    <td>
                      <table id="SearchOptionsList" width="100%" onkeydown="javascript:if(event.keyCode==13){var result = scForm.postEvent(this,event,'TreeSearch_Click',true);scContent.fixSearchPanelLayout(); return result;}">
                        <col align="right" />
                        <col width="100%" />
                        <tr>
                          <td class="scSearchOptionsNameContainer">
                            <a id="SearchOptionsControl0" href="#" class="scSearchOptionName" onclick="javascript:return scForm.postEvent(this,event,'TreeSearchOptionName_Click',true);">
                              <sc:Literal Text="Name:" runat="server" />
                            </a>
                          </td>
                          <td class="scSearchOptionsValueContainer">
                            <input id="SearchOptionsValue0" class="scSearchOptionsInput scIgnoreModified" />
                            <input id="SearchOptionsName0" type="hidden" value="_name" />
                          </td>
                        </tr>
                        <tr>
                          <td valign="top" style="padding: 12px 0 0 0">
                            <a href="#" class="scSearchAddCriteria" onclick="javascript:var result = scContent.addSearchCriteria(this,event);scContent.fixSearchPanelLayout();return result;">
                              <sc:ThemedImage Src="Applications/16x16/view_add.png" Width="16" Height="16" runat="server"
                                              Align="absmiddle" Style="margin: 0 4px 0 0" />
                              <sc:Literal Text="Add Criteria" runat="server" />
                            </a>
                          </td>
                          <td valign="top" class="scSearchOptionsValueContainer scSearchAddCriteriaInput" runat="server">
                            <input id="SearchOptionsAddCriteria" class="scSearchOptionsInput scIgnoreModified"
                                    style="color: #999999" value="<%= Translate.Text(Texts.FIELD1) %>" onkeydown="javascript:if(event.keyCode==13){var result = scContent.addSearchCriteria(this,event);scContent.fixSearchPanelLayout();return result;}"
                                    onfocus="javascript:scContent.watermarkFocus(this,event);" onblur="javascript:scContent.watermarkBlur(this,event);" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="scFlexContentWithoutFlexie scFlexColumnContainerWithoutFlexie" id="SearchResultHolder" style="display: none">
                <div id="SearchHeader" class="scSearchHeader">
                  <a href="#" style="float: right" onclick="javascript:return scContent.closeSearch(this,event);">
                    <sc:ThemedImage runat="server" Src="Images/close.png" Width="16" Height="16" Margin="0px 4px 0px 0px"
                                    RollOver="true" />
                  </a>
                  <sc:ThemedImage runat="server" Src="Applications/16x16/view.png" Width="16" Height="16"
                                  Align="absmiddle" />
                  <span id="SearchResultsHeader"></span>
                </div>
                <div class="scFlexContentWithoutFlexie" id="SearchResult" style="background: white;overflow: auto">
                </div>
              </div>
              <div class="scFlexContentWithoutFlexie" id="ContentTreeHolder">
                <div class="scContentTreeContainer" style="height: 100%">
                  <asp:PlaceHolder ID="ContentTreePlaceholder" runat="server" />
                </div>
              </div>
            </div>
          </div>
          <sc:Border ID="ContentEditor" runat="server" Class="scEditor" />
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
