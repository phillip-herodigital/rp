<%@ Control Language="c#" AutoEventWireup="true" CodeBehind="Logout.ascx.cs" Inherits="Sitecore.Speak.WebSite.layouts.Speak.Sublayouts.LogoutSublayout" %>
<div class="user-info">
    <div class="logout">
        <asp:Label runat="server" ID="LoginName" CssClass="login-name" />
        <asp:LoginStatus OnLoggedOut="OnLoggedOut" CssClass="login-status" runat="server" ID="LoginStatus" />
    </div>
</div>
