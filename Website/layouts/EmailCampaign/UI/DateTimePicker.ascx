<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="DateTimePicker.ascx.cs" Inherits="Sitecore.EmailCampaign.Presentation.UI.DateTimePicker" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls.Specialized" Assembly="Sitecore.Client.Extensions" %>
<%@ Register TagPrefix="sc1" Namespace="Sitecore.EmailCampaign.Presentation.UI" Assembly="Sitecore.EmailCampaign.Presentation.UI" %>
<div class="date-time-selector">
  <asp:Label ID="TitleLabel" runat="server" CssClass="date-time-selector-title" />
  <span>
    <sc:DatePicker ID="DatePicker" runat="server" />
  </span>
  <sc1:TimePicker ID="EditableTimespanTimeDropDownList" runat="server" Width="80" />
</div>
