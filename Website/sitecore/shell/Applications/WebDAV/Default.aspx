<%@ Page Language="c#" Inherits="System.Web.UI.Page" CodePage="65001" %>
<%@ Import Namespace="Sitecore.Web" %>

<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>www.sitecore.net</title>
  <meta content="Microsoft Visual Studio 7.0" name="GENERATOR">
  <meta content="C#" name="CODE_LANGUAGE">
  <meta content="JavaScript" name="vs_defaultClientScript">
  <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
</head>
<body onload="window.setTimeout(function() { document.getElementById('OpenDAVView').click();}, 50)">
  <style>
    a
    {
      behavior: url(#default#AnchorClick);
    }
    
    .defaultmessage
    {
      color:#333333;
      font-family: tahoma;
      font-size: 8pt;
      font-size-adjust: none;
      font-style: normal;
      font-variant: normal;
      font-weight: normal;
      line-height: normal;
      padding:5px;
    }
  </style>
  <form id="mainform" method="post" runat="server">
  <div id="MainPanel">
    <div class="defaultmessage">
      <%= Sitecore.Globalization.Translate.Text(Sitecore.Texts.PleaseWaitWhileDragAndDropViewIsLoaded) %></div>
    <a id="OpenDAVView" href="#" folder="<%= Sitecore.Configuration.WebDAVConfiguration.GetDAVUrl(HttpContext.Current, Sitecore.Data.ID.Parse(HttpContext.Current.Request["optionID"]), true) %>"
      target="_self"></a>
  </form>
</body>
</html>

<script language="C#" runat="server">

protected void Page_Load(object sender, EventArgs args)
{
  if (!Sitecore.Context.User.IsAuthenticated)
  {
    WebUtil.RedirectToLoginPage();
  }
}

</script>