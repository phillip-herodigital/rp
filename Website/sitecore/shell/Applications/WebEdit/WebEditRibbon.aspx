<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebEditRibbon.aspx.cs" Inherits="Sitecore.Shell.Applications.WebEdit.WebEditRibbon" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<sc:DocumentType runat="server" ID="docType"></sc:DocumentType>
<html>
<head runat="server">
  <title>Sitecore</title>
  <sc:Stylesheet runat="server" Src="Content Manager.css" DeviceDependant="true"/><asp:placeholder id="Stylesheets" runat="server" />
  <sc:Stylesheet runat="server" Src="Ribbon.css" DeviceDependant="true" />

  <sc:Stylesheet runat="server" Src="/sitecore/shell/Applications/WebEdit/WebEditRibbon.css"/>
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreObjects.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreKeyboard.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreVSplitter.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreWindow.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/Applications/Content Manager/Content Editor.js"></script>  
  <script type="text/JavaScript" src="/sitecore/shell/Applications/WebEdit/WebEditRibbon.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/Applications/Page Modes/PageEditorProxy.js"></script>    
  <script type="text/Javascript">
    if (scForm) {
      scForm.enableModifiedHandling(function(evt) {
        if (scForm.modified) {
          var pageModes = top.Sitecore.PageModes;
          pageModes.PageEditor.ctrlPressed = false;
          pageModes.ChromeManager.hoverFrame().activate();
          pageModes.ChromeManager.selectionFrame().activate();

          return (evt || window.event).returnValue = scForm.translate("There are unsaved changes.");
        }
      });
    }
  </script>
  <style type="text/css">
    body
    {
      background-color:#e7e7e7;      
    }
    
    #Buttons 
    {
      position: absolute;
      width: 100%;      
      top:0;            
    }

    .no-ribbon #Buttons
    {
      position: relative;
    }

    .scClearingElement
    {
      clear:both;            
    }

    #Buttons button {
      margin:2px;
      width:85px;
      height: 19px;
      color:black;
      font:8pt tahoma;
      background:#d9dbe1 url(/sitecore/shell/themes/standard/images/RibbonNavigatorButtonActive.png) repeat-x;
      border:1px solid #bebebe;
    }
    
    .scButtonDown 
    {
      background:#606060;
    }
    
    img 
    {
    	border:none;
    }

    img.scMenuDevider
    {
      float: left;
    }
    
    a.scCommandIcon
    {
    	float: left;
      outline: none;
      padding: 3px;
      margin: 2px 0 2px 12px;
      display: block;
      line-height: 16px;            
    }

    .no-ribbon  a.scCommandIcon
    {
      margin-top: 4px;
      margin-bottom: 4px;
    }

    a.scCommandIcon img
    {
      display: inline;
      vertical-align: middle;
    }

    a.scCommandIcon span
    {            
      cursor: pointer;                      
      font-size: 11px;
      margin-left: 3px;                
    }
   
    a.scCommandIcon.scDisabledButton, a.scCommandIcon.scDisabledButton span 
    {            
      cursor: default;
      color: #8d8d8d;
    }
    
    a.scCommandIcon:hover, a.scCommandIcon:active 
    {
       border: 1px solid;
       border-color: #ddcf9b #d2c08e #ccc2a3 #d2c08e;
       background: #FFFBD3 url(/sitecore/shell/Themes/Standard/Images/Ribbon/SmallButtonActive.png) repeat-x;
       padding: 2px;
    }

    a.scCommandIcon.scRibbonButtonDown, a.scCommandIcon.scRibbonButtonDown:hover, a.scCommandIcon.scRibbonButtonDown:active
    {
       border: 1px solid;
       border-color: #ddcf9b #d2c08e #ccc2a3 #d2c08e;
       background: #FEE798 url(/sitecore/shell/Themes/Standard/Images/RibbonSmallButtonDown.png) repeat-x;
       padding: 2px;
    }
    
    a.scCommandIcon.scDisabledButton:hover,  a.scCommandIcon.scDisabledButton:active
    {       
       border: none;
       background: transparent;
       padding: 3px;
       text-decoration: none;      
     } 

    a.scToggleIcon
    {
      float: right;
      margin: 2px 10px 4px 0;
      outline: none;     
    }    
  </style>
  
</head>
<body onload="javascript:scOnLoad();">
  <input type="hidden" id="scActiveRibbonStrip" name="scActiveRibbonStrip" />
  <input type="hidden" id="scHtmlValue" name="scHtmlValue" />
  <input type="hidden" id="scPlainValue" name="scPlainValue" />
  <input type="hidden" id="scLayoutDefinition" name="scLayoutDefinition" />
      
  <sc:CodeBeside runat="server" Type="Sitecore.Shell.Applications.WebEdit.WebEditRibbonForm,Sitecore.Client"/>
  
  <form id="RibbonForm" runat="server">           
    <sc:Border ID="Buttons" runat="server" />         
    <sc:Border id="RibbonPanel" Class="scRibbonPanel" runat="server">
      <sc:Border ID="RibbonPane" runat="server"/>
   
      <div id="TreecrumbPane" style="display:none" class="scTreecrumb">
        <sc:Border ID="Treecrumb" runat="server" Class="scTreecrumbBar" />        
      </div>

    </sc:Border>
    
    <div id="NotificationPane">
      <sc:Border runat="server" ID="Notifications" />
    </div>
    
    <input id="__FRAMENAME" type="hidden" value="Shell"/>
    <input id="__SAVEBUTTONSTATE" type="hidden" value="" />
  </form>
</body>
</html>
