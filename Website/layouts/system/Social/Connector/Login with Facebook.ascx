<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Facebook.Client.Connector.Controls.LoginWithFacebook"
  TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<link rel="stylesheet" type="text/css" href='<%= ResolveUrl("~/layouts/system/Social/Connector/Style.css") %>' />
<asp:ImageButton runat="server" ID="facebookLoginButton" CssClass="button" ToolTip="Login with Facebook" OnClick="FacebookLoginButtonOneClick" />