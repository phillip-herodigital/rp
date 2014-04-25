<%@ Page Language="c#" AutoEventWireup="True" Inherits="Sitecore.Login.PasswordRecoveryPage"
  CodeBehind="passwordrecovery.aspx.cs" %>

<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls"
  TagPrefix="sc" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html>
<html>
<head>
  <title>Sitecore</title>
  <link href="/sitecore/login/default.css" rel="stylesheet" />
</head>
<body class="password-recovery">
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
      <div id="FullTopPanel">
        <div class="FullTitle">
          <sc:Literal runat="server" Text="Forgot Your Password?" />
        </div>
        <sc:Literal ID="ForgotPasswordDisabledLabel" runat="server" Visible="False" Text="Forgot Your Password functionality is disabled. Please contact your system administrator." />
        <div class="Centered">
          <asp:PasswordRecovery ID="PasswordRecovery" runat="server" SuccessPageUrl="default.aspx"
            OnVerifyingUser="VerifyingUser" OnSendingMail="SendEmail" CssClass="password-recovery-control">
            <MailDefinition Priority="High" Subject="Sending Per Your Request" From="someone@example.com" />
            <InstructionTextStyle CssClass="titleText" />
            <SuccessTextStyle CssClass="success-text" />
            <LabelStyle CssClass="label" />
            <TextBoxStyle CssClass="textbox" />
            <FailureTextStyle CssClass="failure-text" />
            <SubmitButtonStyle CssClass="submit-button" />
          </asp:PasswordRecovery>
        </div>
      </div>
    </div>
  </div>
  </form>
</body>
</html>
