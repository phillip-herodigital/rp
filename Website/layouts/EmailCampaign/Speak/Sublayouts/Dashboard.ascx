<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Dashboard.ascx.cs" Inherits="Sitecore.Modules.EmailCampaign.Speak.Sublayouts.Dashboard" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Client.Extensions" %>
<%@ Register TagPrefix="speak" Namespace="Sitecore.Speak.Web.UI.WebControls" Assembly="Sitecore.Speak" %>
<%@ Register TagPrefix="ecm" Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.UI.WebControls"
    Assembly="Sitecore.EmailCampaign.App" %>
<script type="text/javascript" src="/sitecore/shell/Applications/Reports/Dashboard/Scripts/Reports.js"></script>
<link rel="stylesheet" type="text/css" href="/sitecore modules/shell/emailcampaign/ui/speak/css/EmailCampaignSpeak.css" />
<sc:accordion runat="server" id="DashboardAccordion" collapsed="false" enablecollapsing="true">
  <header title="">
    <speak:Actions runat="server" ID="DashboardActionsPanel" DataSource="/sitecore/system/Modules/SPEAK/EmailCampaign/Controls/Action panels/Dashboard actions"/>
  </header>  

  <content> 
    <script type="text/javascript" src="/sitecore/shell/Applications/Reports/Dashboard/Scripts/Silverlight.js"></script>
 <div id="DashboardWrapper" class="dashboardSmall" runat="server">
      
     

      <div id="silverlightControlHost" style="height:100%;">
          
        <object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="scSilverlightExecutiveDashboard" width="100%" height="100%">                                     
          <param name="source" value="/sitecore/shell/ClientBin/Sitecore.Shell.Dashboard.xap" />                        
          <param name="onError" value="onSilverlightError" />                    
          <asp:placeholder runat="server" id="SLParameters"></asp:placeholder>          
          <param name="minRuntimeVersion" value="5.0.61118.0" />
          <param name="autoUpgrade" value="true" />
          <param name="windowless" value="true" />
          <param name="onLoad" value="LoadDashboard" />  
           
          <div style="width: 100%; height: 100%;">
              
          <table cellpadding="0" cellspacing="0" border="0" align="center">
            <tr><td><h2>Executive Insight Dashboard</h2></td></tr>
            <tr>
              <td align="left">
                <p>
                  Executive Insight Dashboard requires Microsoft Silverlight 5 to run.<br />
                  Silverlight is a small, safe, cross-platform browser plugin created and supported by Microsoft.</p>
                <br />
                <div align="center">
                  <a href="http://go.microsoft.com/fwlink/?LinkID=149156&amp;v=5.0.61118.0" style="text-decoration: none">
                    <img src="http://go.microsoft.com/fwlink/?LinkId=161376" alt="Get Microsoft Silverlight" style="border-style: none" /></a>
                </div>
              </td>
            </tr>
          </table>
          </div></object><iframe id="_sl_historyFrame" style="visibility:hidden;height:0px;width:0px;border:0px"></iframe>
          <ecm:OverlayControl runat="server" ID="OverlayClickPanel" style="z-index: 10; background-color: white; opacity: 0; height: 100%; position: relative; top: -430px; cursor:pointer;"></ecm:OverlayControl>
      </div>
     
          </div>
          <div id="Warning" class="warnigMessage" runat="server" style="margin:10px;padding:10px;"></div>
          </content> 
</sc:accordion>
<script type="text/javascript">
    function LoadDashboard(sender, args) {
        PluginLoaded(sender, args);

        setTimeout(ReloadDashboard, 500);
    }   
    
    function ReloadDashboard() {
        Reload();
    }
</script>
