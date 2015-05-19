<%@ Page Language="c#" Inherits="System.Web.UI.Page" CodePage="65001" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Analytics" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<sc:Placeholder Key="nl-target-item" runat="server" />
<html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <sc:Placeholder Key="nl-html-title" runat="server" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <style type="text/css">
        p
        {
            margin: 1em 0em 1em 0em;
        }
    </style>
</head>
<body bgcolor="white">    
    <form id="mainform" method="post" runat="server">
    <div style="font-size: 11px; font-family: arial,helvetica,sans-serif; height: auto;
        padding: 6px; text-align: center;">
        <center>
            <table id="maintable" cellspacing="0" cellpadding="0" border="0" style="font-family: arial,helvetica,sans-serif;
                text-align: left; margin-left: auto; margin-right: auto;" width="616">
                <tr>
                    <td colspan="8" style="font-size: 1px;">&#32;</td>
                    <td colspan="4" align="right" style="font-size: 10px;">
                        <sc:Placeholder Key="nl-header" runat="server" />
                    </td>
                    <td colspan="8" style="font-size: 1px;">&#32;</td>
                </tr>
                <tr>
                    <td colspan="8">
                        <img height="4" width="8" border="0" style="border-color: transparent; display: block;" alt=""
                            src="~/media/Images/Newsletter/Common/Shadow/top_shadow_left.ashx" /></td>
                    <td colspan="4">
                        <img height="4" width="600" border="0" style="border-color: transparent; display: block;" alt=""
                            src="~/media/Images/Newsletter/Common/Shadow/top_shadow.ashx" /></td>
                    <td colspan="8">
                        <img height="4" width="8" border="0" style="border-color: transparent; display: block;" alt=""
                            src="~/media/Images/Newsletter/Common/Shadow/top_shadow_right.ashx" /></td>
                </tr>
                <tr>
                    <td colspan="8">
                        <img height="108" width="8" border="0" style="border-color: transparent; display: block;" alt=""
                            src="~/media/Images/Newsletter/Common/Shadow/header_shadow_left.ashx" /></td>
                    <td colspan="4">
                        <sc:Placeholder Key="nl-top-image" runat="server" />
                    </td>
                    <td colspan="8">
                        <img height="108" width="8" border="0" style="border-color: transparent; display: block;" alt=""
                            src="~/media/Images/Newsletter/Common/Shadow/header_shadow_right.ashx" /></td>
                </tr>
                <tr valign="top">
                    <%--Left Shadow--%>
                    <td width="1" bgcolor="#FEFEFE" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#FDFDFD" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#FBFBFC" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#F8F9FA" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#F5F6F8" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#F1F2F5" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#ECEEF1" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#E6E7ED" style="font-size: 1px;">&#32;</td>
                    <%--White Spase--%>
                    <td width="9">
                        <img height="2" width="9" border="0" style="border-color: transparent; display:block;" alt="" src="~/media/Images/Newsletter/Common/bg_white.ashx" /></td>
                    <%--content--%>
                    <td width="591" style="font-size: 12px;">
                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: arial,helvetica,sans-serif; font-size: 11px;">
                            <tr>
                                <td><img height="2" width="591" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/white_line.ashx" /></td>
                            </tr>
                            <tr>
                                <td height="18"><div style="height: 18px;">&#32;</div></td>
                            </tr>
                        </table>
                        <sc:Placeholder Key="nl-body" runat="server" />
                    </td>
                    <%--Right Shadow--%>
                    <td width="1" bgcolor="#E6E7ED" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#ECEEF1" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#F1F2F5" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#F5F6F8" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#F8F9FA" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#FBFBFC" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#FDFDFD" style="font-size: 1px;">&#32;</td>
                    <td width="1" bgcolor="#FEFEFE" style="font-size: 1px;">&#32;</td>
                </tr>
                <tr>
                <td colspan="20">
                    <img height="26" width="616" border="0" style="border-color: transparent; display: block;" alt=""
                        src="~/media/Images/Newsletter/Common/Shadow/bottom_shadow.ashx" /></td>
                </tr>
                <tr>
                    <td colspan="8" style="font-size: 1px;">&#32;</td>
                    <td colspan="4">
                        <sc:Placeholder Key="nl-footer" runat="server" />
                    </td>
                    <td colspan="8" style="font-size: 1px;">&#32;</td>
                </tr>
            </table>
        </center>
    </div>
    </form>
</body>
</html>