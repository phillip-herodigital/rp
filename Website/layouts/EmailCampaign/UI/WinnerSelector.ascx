<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="WinnerSelector.ascx.cs" Inherits="Sitecore.EmailCampaign.Presentation.UI.WinnerSelector" %>
<%@ Import Namespace="Sitecore.EmailCampaign.Domain" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Client.Extensions" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.UI.WebControls" Assembly="Sitecore.EmailCampaign.App" %>
<asp:Panel runat="server" ID="WinnerSelectorControl">
  <h2>
    <%= Model.Texts.SelectAbWinner %>
  </h2>
  <span>
    <%= Model.Texts.AutomaticallyOrManuallySelectAbWinner %>
  </span>
  <asp:HiddenField runat="server" ID="WinnerSelectorHiddenField" Value="0" />
  <sc:TabStrip ID="WinnerSelectorTabs" runat="server" CssClass="select-ab-winner">
    <sc:Tab runat="server">
      <div class="auto-winner-selector" style="height: 50px">
      <div style="float:none; clear: both;">
          <div style="float:left">
            <span>
              <%= Model.Texts.AutomaticallySelectWinnerAfter %>
            </span>
            <asp:TextBox runat="server" ID="PeriodSelector" Text="12" />
            <asp:DropDownList runat="server" ID="PeriodTypesSelector" />
            <span>
              <%= Model.Texts.Using %>
            </span>
          </div>
          <div>
            <asp:RadioButtonList ID="SelectWinnerOptions" runat="server"></asp:RadioButtonList>
          </div>
        </div>
        <div>
          <asp:Label runat="server" ID="TestingStartedWithoutAutoSelection" Visible="False"><%= Model.Texts.TheAutomaticWinnerSelectionHasNotBeenConfigured %></asp:Label>
        </div>
      </div>
    </sc:Tab> 
    <sc:Tab runat="server">
      <sc:SelectAbWinnerDetailList ID="ManualWinnerSelector" runat="server" DataSource="{28A3FCD0-EF67-4A88-B906-40C2DFD37E98}"/>
    </sc:Tab>
  </sc:TabStrip>
</asp:Panel>
