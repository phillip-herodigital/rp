<%@ Page Language="c#" Inherits="System.Web.UI.Page" CodePage="65001" Debug="true" %>

<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Analytics" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>
        <sc:Placeholder Key="html-title" runat="server" />
    </title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <style type="text/css">
        p
        {
            margin: 1em 0em 1em 0em;
        }
        a
        {
            color: #c73318;
            text-decoration: none;
        }
    </style>
    <!-- The VisitorIdentification control ensures that people viewing this page 
     with a traditional web browser will be classified as humans not bots.
     This control is not required if people only view messages using Email clients -->
    <sc:VisitorIdentification runat="server" />
</head>
<body bgcolor="white">
    <form id="mainform" method="post" runat="server">
    <div style="font-size: 12px; font-family: arial,helvetica,sans-serif; height: auto;
        padding: 6px; text-align: center;">
        <sc:Placeholder Key="edit-subject" runat="server" />
        <center>
            <table id="maintable" cellspacing="0" cellpadding="0" border="0" style="font-family: arial,helvetica,sans-serif;
                text-align: left; margin-left: auto; margin-right: auto;" width="600">
                <tr>
                    <td colspan="3" align="right" style="font-size: 11px;">
                        <sc:Placeholder Key="header" runat="server" />
                    </td>
                </tr>
                <tr valign="top">
                    <!--content-->
                    <td width="405" style="font-size: 12px;">
                        <img height="12" width="1" border="0" style="border-color: transparent;" alt="" src="~/media/Images/EC%20Newsletter%20Example/whitespace.ashx" /><br />
                        <sc:Placeholder Key="content" runat="server" />
                    </td>
                    <!--separator-->
                    <td width="6">
                        <img height="1" width="6" border="0" style="border-color: transparent;" alt="" src="~/media/Images/EC%20Newsletter%20Example/whitespace.ashx" /><br />
                    </td>
                    <!--Sidebar-->
                    <td bgcolor="#F1F1F1" width="189" style="font-size: 11px;">
                        <img height="12" width="189" border="0" style="border-color: transparent;" alt=""
                            src="~/media/Images/EC%20Newsletter%20Example/dgrayspace.ashx?w=189&as=1" /><br />
                        <sc:Placeholder Key="Sidebar" runat="server" />
                        <div style="height: 12px; font-size: 1px; overflow: hidden;">
                            &#xA0;
                        </div>
                    </td>
                </tr>
            </table>
        </center>
        <div id="footerPanel" style="margin-top: 4px; text-align: left;">
            <sc:Placeholder Key="footer" runat="server" />
        </div>
    </div>
    </form>
</body>
</html>