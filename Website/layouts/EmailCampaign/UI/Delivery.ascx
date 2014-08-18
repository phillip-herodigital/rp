<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Delivery.ascx.cs" Inherits="Sitecore.EmailCampaign.Presentation.UI.Delivery" %>
<%@ Register TagPrefix="sc" TagName="DateTimePicker" Src="DateTimePicker.ascx" %>
<h2>
  <%= Model.Texts.Delivery %></h2>
<asp:Label ID="SubHeaderLabel" runat="server" />
<asp:RadioButtonList ID="DeliveryModeRadioButtonList" runat="server" />
<asp:Panel ID="SchedulerOptionsPanel" runat="server" CssClass="datetimezone-selector">
  <sc:DateTimePicker ID="FromDateTimePicker" runat="server" DefaultValue="Current" />
  <sc:DateTimePicker ID="ToDateTimePicker" runat="server" DefaultValue="Empty" />
  <div class="timezone-selector">
    <span class="timezone-selector-title">
      <%= this.Model.Texts.Timezone %></span>
    <asp:DropDownList ID="TimeZoneDropDownList" runat="server" /> 
    <asp:HiddenField ID="hfTimeZone" runat="server" /> 
      <script type="text/javascript"> 
          $(function () { var stzDdl = new SelectableValueFromDdl('<%=TimeZoneDropDownList.ClientID%>', '<%=hfTimeZone.ClientID%>'); });
      </script>
  </div>
</asp:Panel>
