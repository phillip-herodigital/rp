<%@ Page Language="C#" AutoEventWireup="true" %>

<script runat="server">

// TODO: to enable the page, set enableUnlockButton = true;
private bool enableUnlockButton = false;

protected void Page_Load(object sender, EventArgs e)
{
    this.unlockButton.Enabled = this.enableUnlockButton;
}

protected void unlockButton_Click(object sender, EventArgs e)
{
    if (!this.enableUnlockButton)
    {
        return;
    }

    Membership.GetUser("sitecore\\admin").UnlockUser();
    this.resultMessageLiteral.Visible = true;
    this.unlockButton.Visible = false;
}

protected void descriptionLiteral_PreRender(object sender, EventArgs e)
{
    this.descriptionLiteral.Visible = !this.enableUnlockButton;
}

</script>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <title>Unlock Administrator Page</title>

    <style type="text/css">

    body
    {
        font-family: normal 11pt "Times New Roman", Serif;
  }

    .Warning
    {
        color: red;
    }

    </style>

</head>

<body>

<form runat="server" id="form">

<asp:Literal
    runat="server"
    ID="descriptionLiteral"
    EnableViewState="false"
    OnPreRender="descriptionLiteral_PreRender">
    <p>This page is currently disabled.</p>
    <p>To enable the page, modify the ASPX page and set enableUnlockButton = true.</p>
</asp:Literal>
<asp:Literal
    runat="server"
    ID="resultMessageLiteral"
    Visible="false">
    <p>The Administrator user has been successfully unlocked.</p>
    <p class="Warning">Do not forget to set enableUnlockButton = false in the ASPX page again.</p>
</asp:Literal>
<asp:Button
    runat="server"
    ID="unlockButton"
    Text="Unlock Administrator"
    OnClick="unlockButton_Click"/>

</form>

</body>

</html>