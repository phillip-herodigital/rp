<%@ Page Language="C#" AutoEventWireup="true" Codebehind="Default.aspx.cs" Inherits="Sitecore.Shell.Applications.Workbox.WorkboxPage" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head runat="server">
  <asp:placeholder id="BrowserTitle" runat="server"></asp:placeholder>
  <sc:Stylesheet runat="server" Src="Content Manager.css" DeviceDependant="true" />
  <sc:Stylesheet runat="server" Src="Workbox.css" DeviceDependant="true" />
  <script type="text/JavaScript" language="javascript" src="/sitecore/shell/controls/SitecoreObjects.js"></script>
  <script type="text/JavaScript" language="javascript" src="/sitecore/shell/controls/SitecoreWindow.js"></script>
  <script type="text/JavaScript" language="javascript" src="/sitecore/shell/Applications/Content Manager/Content Editor.js"></script>
</head>
<body class="scWindowBorder1">
  <form id="WorkboxForm" runat="server">

  <table class="scPanel scWorkboxPanel scWindowBorder2" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td id="CaptionTopLine">
        <img src="/sitecore/images/blank.gif" alt="" />
      </td> 
    </tr>
    
    <tr>
      <td class="scWorkboxWindowCaption scCaption scWindowHandle"
        onmousedown="scWin.mouseDown(this, event)"
        onmousemove="scWin.mouseMove(this, event)"
        onmouseup="scWin.mouseUp(this, event)"
        ondblclick="scWin.maximizeWindow()"
        onactivate="scWin.activate(this, event)">

        <div class="scWorkboxWindowButtons">
          <asp:PlaceHolder ID="WindowButtonsPlaceholder" runat="server" />
        </div> 

      </td>
    </tr>
  
    <tr>
      <td height="100%">
        
        <table class="scPanel" cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
          <tr>
            <td class="scWindowBorder3"><img src="/sitecore/images/blank.gif" class="scWindowBorder4" alt="" /></td>

            <td id="WorkboxFrame">
              <iframe src="/sitecore/shell/default.aspx?xmlcontrol=Workbox&mo=preview" width="100%" height="100%" frameborder="0"></iframe>
            </td>
            
            <td class="scWindowBorder3"><img src="/sitecore/images/blank.gif" class="scWindowBorder4" alt="" /></td>
          </tr>
        </table>
        
      </td>
    </tr>

    <tr>
       <td height="2" class="scWindowBorder3"><img src="/sitecore/images/blank.gif" height="2" width="1" alt="" border="0" /></td>
    </tr>
    
    <asp:PlaceHolder ID="Pager" runat="server" />

  </table>
  </form>
</body>
</html>
