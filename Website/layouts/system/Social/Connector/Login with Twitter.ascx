<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Twitter.Client.Connector.Controls.LoginWithTwitter"
  TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<link rel="stylesheet" type="text/css" href='<%= ResolveUrl("~/layouts/system/Social/Connector/Style.css") %>' />
<asp:ImageButton runat="server" ID="twitterLoginButton" CssClass="button" ToolTip="Login with Twitter" OnClick="TwitterLoginButtonOneClick" />