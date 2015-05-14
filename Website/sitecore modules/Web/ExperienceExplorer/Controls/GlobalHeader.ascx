<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="GlobalHeader.ascx.cs" Inherits="Sitecore.ExperienceExplorer.Web.Web.ExperienceExplorer.Controls.GlobalHeader" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>

<link type="text/css" rel="stylesheet" href="/sitecore/shell/Themes/Standard/Default/GlobalHeader.css" />
<link type="text/css" rel="stylesheet" href="/sitecore modules/Web/ExperienceExplorer/Assets/css/experience-explorer-global-header.css" />
<header class="sc-globalHeader">
  <div class="sc-globalHeader-content">
    <div class="col2">
      <div class="sc-globalHeader-startButton">
        <a class="sc-global-logo" href='javascript:$.get("/?sc_mode=edit", function (){window.location="/sitecore/shell/sitecore/client/Applications/LaunchPad";});'></a>
      </div>
    </div>
    <div class="col2">
      <div class="sc-globalHeader-loginInfo">

        <ul class="sc-accountInformation">
          <li>
            <span class="logout" onclick='javascript:$.get("/api/sitecore/Authentication/Logout?sc_database=master", function (){window.location.reload();});' >
              <%=GetLogoutHeaderText()%>
            </span>
          </li>
          <li>
            <%=GetGlobalHeaderUserName()%>
            <img src="<%=GetGlobalHeaderUserPortraitUrl()%>"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</header>

