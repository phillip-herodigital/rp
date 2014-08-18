<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Notification.ascx.cs" Inherits="Sitecore.EmailCampaign.Presentation.UI.Notification" %>
<h2>
  <%= Model.Texts.Notification %></h2>
<asp:CheckBox ID="EnableNotificationsCheckBox" runat="server" />
<div class="notify">
  <asp:TextBox ID="EmailAddressessTextBox" runat="server" />
  <span><i>
    <%= Model.Texts.ForMoreThanOneEmailUseCommaAsSeparator %></i></span></div>
