<%@ Control Language="c#" AutoEventWireup="true" EnableViewState="false" CodeBehind="SpamCheck.ascx.cs" Inherits="Sitecore.Modules.EmailCampaign.Speak.Sublayouts.SpamCheck" %>
<%@ Import Namespace="Sitecore.Modules.EmailCampaign.Core" %>
<%@ Import Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.Core" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.UI.WebControls" Assembly="Sitecore.EmailCampaign.App" %>

<asp:Panel runat="server" ID="MainPanel">
    <div class="review-top-panel">
        <asp:Panel ID="SpinnerPanel" style="text-align:center;vertical-align: middle;" runat="server">
            <img src="/sitecore/apps/img/sc-spinner16.gif" height="16" width="16" />
        </asp:Panel>
        <div id="MessageContainer" runat="server" visible="False">
            <asp:Label runat="server" ID="MessageLabel"></asp:Label>
        </div>
        <div id="MessageVariantsContainer" runat="server">
            <sc:SelectVariantGroup ID="MessageVariants" CssClass="select-variant-group" runat="server" />
        </div>
        <asp:Panel runat="server" ID="PreviewPanel" class="preview-panel" Style="width: 100%">
            <div>
                <sc:AjaxButton ID="RunTest" UseSubmitBehavior="False" CssClass="sc-button sc-button-important" Style="float: left;" runat="server" />
                <div id="SpamFiltersContainer" runat="server" style="float: right; margin-right: 5px;"></div>
                <div id="ReportListContainer" runat="server" style="float: right; margin-right: 5px;"></div>
            </div>
            <div class="selcted-variant">
                <span><%=EcmTexts.Localize(EcmSpeakTexts.CheckVariants)%></span>
                <div style="display: inline;"></div>
            </div>
        </asp:Panel>
    </div>

    <sc:SpamCheckResult ID="ReviewResult" runat="server" />
</asp:Panel>

