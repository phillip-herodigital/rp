<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Intro.ascx.cs" Inherits="Website.layouts.Modules.Intro" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<div>
    <p><%=FieldRenderer.Render(CurrentContextItem, "Content Piece 1") %></p>

    <p><%=FieldRenderer.Render(CurrentContextItem, "Content Piece 2") %></p>

    <p><%=FieldRenderer.Render(CurrentContextItem, "Content Piece 3") %></p>

    <p><%=FieldRenderer.Render(CurrentContextItem, "Border Color") %></p>
</div>