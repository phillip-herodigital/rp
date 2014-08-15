<%@ Page Language="c#" Inherits="System.Web.UI.Page" CodePage="65001" %>

<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Analytics" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<sc:Placeholder Key="msg-target-item" runat="server" />
<html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <sc:Placeholder Key="msg-html-title" runat="server" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
        <style type="text/css">
        p
        {
            margin-top: 4px;
            margin-bottom: 4px;
        }
    </style>

</head>
<body bgcolor="white">
    <form id="mainform" method="post" runat="server">
    <div style="font-size: 9pt; font-family: 'Arial','sans-serif'; text-align: left; height: auto; padding: 6px;">
        <div id="contentPanel">
            <sc:Placeholder Key="msg-body" runat="server" />
        </div>
        <div id="footerPanel" style="margin-top: 4px;">
            <sc:Placeholder Key="msg-footer" runat="server" />
        </div>
    </div>
    </form>
</body>
</html>
