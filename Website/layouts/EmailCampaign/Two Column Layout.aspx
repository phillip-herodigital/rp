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
    <div style="font-size: 9pt; font-family: 'arial','sans-serif'; text-align: left; height: auto; padding: 6px;">
        <table cellspacing="0" cellpadding="0" border="0" style="font-size: 9pt; font-family: 'arial','sans-serif';" width="100%">
            <tr valign="top">
                <td bgcolor="#F9F9F9" style="border-top: 1px solid #CECECE; border-bottom: 1px solid #CECECE;">
                    <sc:Placeholder Key="msg-body" runat="server" />
                </td>
                <td width="6">
                    <div style="width: 6px; font-size: 1px; overflow: hidden;">&nbsp;</div>
                </td>
                <td bgcolor="#F1F1F1" width="280">
                    <div style="margin:12px;">
                        <sc:Placeholder Key="msg-sidebar" runat="server" />
                    </div>
                </td>
            </tr>
        </table>
        <div id="footerPanel" style="margin-top: 4px;">
            <sc:Placeholder Key="msg-footer" runat="server" />
        </div>
    </div>
    </form>
</body>
</html>
