<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Photo Lockup.ascx.cs" Inherits="Website.layouts.Modules.Photo_Lockup" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<div>
    <p><%=FieldRenderer.Render(CurrentContextItem, "Title") %></p>

    <p><%=FieldRenderer.Render(CurrentContextItem, "Content") %></p>

    <p><%=FieldRenderer.Render(CurrentContextItem, "Citation") %></p>

    <p><%=FieldRenderer.Render(CurrentContextItem, "Background Color") %></p>

    <p><%=FieldRenderer.Render(CurrentContextItem, "Border Color") %></p>
</div>