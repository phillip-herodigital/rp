<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Dialog.aspx.cs" Inherits="Sitecore.Speak.WebSite.Dialog" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<!DOCTYPE html>
<html>
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title id="Title1" runat="server">
        <sc:Text ID="Text1" Field="title" runat="server" />
    </title>
    
</head>
<body>
    <form id="DialogForm" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div class="popup-instance">
        <div class="ui-corner-all ui-widget-content ui-widget ui-dialog">
            <div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">
                <asp:LinkButton ID="CloseButton" runat="server" CssClass="cancel close ui-dialog-titlebar-close ui-corner-all ui-icon ui-icon-closethick" OnClick="OnClose"> </asp:LinkButton>
                 
                <div class="ui-dialog-title">
                    <sc:Text ID="Text2" runat="server" Field="title" />
                     <sc:Placeholder ID="phActions" Key="actions" runat="server" />
                </div>
            </div>
            <sc:Placeholder ID="phTop" Key="top" runat="server" />
            <div class="ui-dialog-content ui-widget-content">
                <div class="ui-dialog-main-content" style="height: auto; overflow: auto;">
                    <sc:Placeholder ID="phMain" Key="main" runat="server" />
                </div>
            </div>
            <div class="ui-dialog-buttonset">
              <sc:Placeholder ID="phButtons" Key="buttons" runat="server" />
            </div>
            <div class="ui-dialog-footer">
                <sc:Placeholder ID="phBottom" Key="bottom" runat="server" />
            </div>
        </div>
    </div>
    </form>
</body>
</html>
