<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.LinkedIn.Client.Connector.Controls.LoginWithLinkedIn"
  TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<link rel="stylesheet" type="text/css" href='<%= ResolveUrl("~/layouts/system/Social/Connector/Style.css") %>' />
<asp:ImageButton runat="server" ID="linkedInLoginButton" CssClass="button" ToolTip="Login with LinkedIn" OnClick="LinkedInLoginButtonClick" />