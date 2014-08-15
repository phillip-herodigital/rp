<%@ Page Language="c#" Inherits="Sitecore.Speak.WebSite.Default" CodeBehind="Default.aspx.cs" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Client.Extensions" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<%@ Register TagPrefix="sc" TagName="Logout" Src="../Sublayouts/Logout.ascx" %>
<!DOCTYPE html>
<html>
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title id="Title1" runat="server">
        <sc:Text ID="txtPageTitle" Field="title" runat="server" />
    </title>
    <link rel="stylesheet" type="text/css" media="screen" href="/sitecore/apps/css/style.css" />
    <sc:Placeholder ID="phHead" Key="head" runat="server" />
</head>
<body>
    <form id="mainform" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div class="page-content">
        <div class="header">
            <div class="page">
                <sc:Logout runat="server" />
                <a href="<%=ApplicationStart%>" title="<%=ApplicationName%>" class="speak-logo"></a>
            </div>
        </div>
        <div class="top">
            <div class="page">
                <sc:Placeholder ID="phTop" Key="top" runat="server" />
            </div>
        </div>
        <div class="content-container">
            <div class="content page">
                <sc:Placeholder ID="phMain" Key="main" runat="server" />
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="page">
            
        </div>
    </div>
    </form>
</body>
</html>
