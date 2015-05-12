<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="GlobalHeader.ascx.cs" Inherits="Sitecore.ExperienceExplorer.Web.Web.ExperienceExplorer.Controls.GlobalHeader" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>

<link type="text/css" rel="stylesheet" href="/sitecore modules/web/experienceexplorer/controls/GlobalHeader.css" />
<header class="sc-globalHeader">
  <div class="sc-globalHeader-content">
    <div class="col2">
      <div class="sc-globalHeader-startButton">
        <a class="sc-global-logo" href="/sitecore/shell/sitecore/client/Applications/LaunchPad"></a>
      </div>
    </div>
    <div class="col2">
      <div class="sc-globalHeader-loginInfo">

        <ul class="sc-accountInformation">
          <li>
            <span class="logout" onclick='javascript:$.get("/api/sitecore/Authentication/Logout?sc_database=master", function (){window.location.reload();});' >
              <sc:Literal Text="Logout" runat="server" />
            </span>
          </li>
          <li>
            <asp:Literal ID="globalHeaderUserName" runat="server" />
            <sc:ThemedImage ID="globalHeaderUserPortrait" runat="server"></sc:ThemedImage>
          </li>
        </ul>
      </div>
    </div>
  </div>
</header>

