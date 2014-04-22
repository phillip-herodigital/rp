<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Leader.ascx.cs" Inherits="Website.layouts.Pages.Marketing.Leader" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<%=FieldRenderer.Render(CurrentContextItem, "Image") %>

<%=FieldRenderer.Render(CurrentContextItem, "Name") %>

<%=FieldRenderer.Render(CurrentContextItem, "Location") %>

<%=FieldRenderer.Render(CurrentContextItem, "Description") %>