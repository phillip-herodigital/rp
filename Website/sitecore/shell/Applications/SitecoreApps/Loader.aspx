<%@ Page Inherits="Sitecore.Apps.Loader.LoaderPage" %>
<%@ Import Namespace="Sitecore.Web" %>

<script language="C#" runat="server">

protected void Page_Load(object sender, EventArgs args)
{
  if (!Sitecore.Context.User.IsAuthenticated)
  {
    WebUtil.RedirectToLoginPage();
  }
}

</script>