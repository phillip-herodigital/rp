<%@ Page Language="c#" AutoEventWireup="True" Inherits="Sitecore.Login.ChangePasswordPage" CodeBehind="ChangePassword.aspx.cs" %>

<%@ Register TagPrefix="sc" Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html>
<html>
<head>
  <title>Sitecore</title>
  <link href="/sitecore/login/default.css" rel="stylesheet" />
</head>
<body class="change-password">
  <form id="LoginForm" runat="server">
  <div id="Body">
    <div id="Banner">
      <div id="BannerPartnerLogo">
        <asp:PlaceHolder ID="PartnerLogo" runat="server" />
      </div>
      <img id="BannerLogo" src="/sitecore/login/logo.png" alt="Sitecore Logo" border="0" />
    </div>
    <div id="Menu">
      &nbsp;
    </div>
    <div id="FullPanel">
      <div id="FullTopPanel" style="padding: 0px 0px 32px 0px">
        <div class="FullTitle">
          <sc:Literal runat="server" Text="Change Your Password." />
        </div>
        <sc:Literal ID="ChangePasswordDisabledLabel" runat="server" Visible="False" Text="Change Password  functionality is disabled. Please contact your system administrator." />
        <div class="Centered">
          <asp:ChangePassword ID="ChangePassword" runat="server" CancelDestinationPageUrl="default.aspx"
            DisplayUserName="True" ContinueDestinationPageUrl="default.aspx" CssClass="change-password-control">
            <CancelButtonStyle CssClass="cancel-button" />
            <ChangePasswordButtonStyle CssClass="submit-button" />
            <ContinueButtonStyle CssClass="submit-button" />
            <TitleTextStyle CssClass="titleText" />
            <PasswordHintStyle CssClass="password-hint" />
            <InstructionTextStyle CssClass="instruction-text" />
            <LabelStyle CssClass="label" />
            <TextBoxStyle CssClass="textbox" />
          </asp:ChangePassword>
        </div>
      </div>
    </div>
  </div>
  </form>
</body>
</html>