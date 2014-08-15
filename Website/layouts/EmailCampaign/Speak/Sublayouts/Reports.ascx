<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Reports.ascx.cs" Inherits="Sitecore.Modules.EmailCampaign.Speak.Sublayouts.Reports" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Client.Extensions" %>
<%@ Register TagPrefix="ecm" Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.UI.WebControls" assembly="Sitecore.EmailCampaign.App" %>
<sc:accordion id="Portlet1" runat="server" collapsed="false" enablecollapsing="true">
    <Header Title="Reports TODO" />
    <Content> 
      <div style="position:relative;"> 
        <iframe id="graph" height="500px" width="100%" frameborder="no" marginheight="0" marginwidth="0" allowtransparency="true" runat="server" src="/sitecore/shell/sitecore/content/Applications/Analytics/Executive Dashboard.aspx?DefaultReport=Traffic;50;Visits;false" />                            
        <ecm:OverlayControl runat="server" style="height:500px; width:100%; cursor:pointer; position:absolute; top:0px; left:0px;" OnClick="OverlayClicked" ></ecm:OverlayControl>
      </div>           
     </Content>

</sc:accordion>

