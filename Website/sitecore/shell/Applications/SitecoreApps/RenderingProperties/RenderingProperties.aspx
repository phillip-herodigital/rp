<%@ Page Inherits="Sitecore.Apps.TagInjection.WebControls.RenderingPropertiesPage" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head runat="server">
  <link href="RenderingProperties.css" type="text/css" rel="stylesheet" />
  <asp:Literal ID="Output" runat="Server" />
</head>
<body class="RenderingProperties">
  <form id="Form" name="Form" runat="server" style="display: none;">
    <sc:CodeBeside runat="server" Type="Sitecore.Apps.TagInjection.WebControls.RenderingPropertiesForm, Sitecore.Apps.TagInjection" />
  </form>
</body>
</html>

