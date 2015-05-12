<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.GooglePlus.Client.Connector.Controls.LoginWithGoogle"
  TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<link rel="stylesheet" type="text/css" href='<%= ResolveUrl("~/layouts/system/Social/Connector/Style.css") %>' />
<asp:ImageButton runat="server" ID="googleLoginButton" CssClass="button" ToolTip="Login with Google " OnClick="GoogleLoginButtonClick" />