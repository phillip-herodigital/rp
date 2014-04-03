<%@ Page language="c#" AutoEventWireup="false" %>
<%@ Import namespace="Sitecore"%>
<%@ Import namespace="Sitecore.Data.Items"%>
<%@ Import namespace="Sitecore.Publishing"%>
<%
  Sitecore.Configuration.State.Client.NoDesktop = true;
  PreviewManager.StoreShellUser(true);
  Response.Redirect("/?sc_mode=preview");
%>