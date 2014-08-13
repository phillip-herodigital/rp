<%@ Page Language="c#" AutoEventWireup="true" Inherits="Sitecore.Speak.WebSite.layouts.Speak.Layouts.LoginPage"
    CodeBehind="Login.aspx.cs" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>
        <sc:Text Field="title" runat="server" />
    </title>
    
    <link rel="stylesheet" type="text/css" media="screen" href="/sitecore/apps/css/style.css" />
</head>
<body class="login-page">
    <form runat="server" autocomplete="off">
    <div class="page">
        <div class="content">
            <div class="login">
                <div class="login-block">
                    <sc:Placeholder runat="server" ID="MainPlaceholder" Key="LoginPlaceholder" />
                </div>
            </div>
        </div>
    </div>
    </form>
</body>
</html>
