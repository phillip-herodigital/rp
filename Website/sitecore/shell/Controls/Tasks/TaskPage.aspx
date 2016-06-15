<%@ Page language="c#" Inherits="Sitecore.Shell.Web.UI.SecurePage" Codepage="65001" AutoEventWireup="true" %>
<%@ register TagPrefix="ui" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<ui:renderitem runat="server" datasource="/sitecore/content/Applications/Control panel/Database tasks"/>