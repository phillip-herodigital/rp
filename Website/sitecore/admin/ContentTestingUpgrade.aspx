<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ContentTestingUpgrade.aspx.cs" Inherits="Sitecore.ContentTesting.Upgrade.ContentTestingUpgrade" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <title>Upgrade Testing Data</title>
  <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
  <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />

  <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.watermark.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
  <style type="text/css">
    .error {
      color: red;
    }
  </style>
</head>
<body>
  <form id="form1" runat="server" class="wf-container">
    <asp:ScriptManager runat="server"></asp:ScriptManager>
    <asp:Timer ID="ProgressTimer" Interval="2000" runat="server" OnTick="ProgressTimer_Tick" Enabled="False"></asp:Timer>
    <div class="wf-content">
      <h1>Upgrade Content Testing data</h1>
      <p class="wf-subtitle">Update and transform content testing data after upgrading from Sitecore 8.0</p>
      <asp:UpdatePanel runat="server">
        <ContentTemplate>
          <div class="wf-configsection">
            <h2><span>Steps</span></h2>
            <p>All steps should be completed to complete the upgrade.</p>
            <p>Steps may be executed individually in the event of errors.</p>
            <asp:CheckboxList runat="server" ID="StepList" DataTextField="Value" DataValueField="Key"/>
            <p>
              <asp:Button runat="server" ID="StartButton" OnClick="Start" Text="Start" />
            </p>
          </div>
          <div class="wf-configsection">
            <h2><span>Status</span></h2>
            <div>
              <asp:Literal runat="server" ID="Output"></asp:Literal>
            </div>
          </div>
        </ContentTemplate>
        <Triggers>
          <asp:AsyncPostBackTrigger ControlID="ProgressTimer" EventName="Tick" />
        </Triggers>
      </asp:UpdatePanel>
    </div>
  </form>
</body>
</html>
