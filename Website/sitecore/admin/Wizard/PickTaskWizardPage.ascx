<%@ Control Language="C#" AutoEventWireup="true" Codebehind="PickTaskWizardPage.ascx.cs"
   Inherits="Sitecore.Update.Wizard.PickTaskWizardPage" %>
<style type="text/css">
      #actions { margin-top: 1em } 
    </style>
<p>
   You are about to install <em runat="server" id="PackageName"></em>.</p>
<div class="wf-statebox wf-statebox-warning">
   <p style="margin: 0">
      Files overwritten or deleted during the installation will be saved to a backup folder.</p>
</div>
<div id="actions" class="wf-actionbuttons">
   <asp:LinkButton ID="AnalyzeInstall" CssClass="wf-actionbutton" runat="server" OnClick="AnalyzeBtn_Click">
      <img alt="Analyze" src="/~/icon/Core/32x32/search.png.aspx" />
      <span  class="wf-title">
         Analyze</span >
      <span  class="wf-subtitle">
         Analyze the package for potential installation conflicts</span >
   </asp:LinkButton>
   <asp:LinkButton ID="Install" runat="server" OnClick="InstallBtn_Click" CssClass="wf-actionbutton">
      <img alt="Install" src="/~/icon/Applications/32x32/media_play_green.png.aspx" />
      <span  class="wf-title">
         Install</span >
      <span  class="wf-subtitle">
         Install the package immediately</span >
   </asp:LinkButton>
</div>
