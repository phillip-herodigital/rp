<%@ Page Language="c#" AutoEventWireup="true" %>

<%@ Import Namespace="Sitecore.Modules.EmailCampaign" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Subscription Confirmation</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <link href="/default.css" rel="stylesheet" />
</head>

<script language="C#" runat="server">
    private void Page_Load(object sender, EventArgs e)
    {
        string url = null;
        string cid = Request.QueryString[GlobalSettings.ConfirmSubscriptionQueryStringKey];

        if (!string.IsNullOrEmpty(cid))
            url = ClientApi.ConfirmSubscription(cid);

        if (url == null)
            url = Sitecore.Configuration.Settings.ItemNotFoundUrl;

        Sitecore.Web.WebUtil.Redirect(url);
    }
</script>

<body>
</body>
</html>
