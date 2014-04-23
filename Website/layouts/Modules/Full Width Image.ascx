<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Full Width Image.ascx.cs" Inherits="Website.layouts.Modules.Full_Width_Image" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing full-width-image" style="<%=InlineStyles %>">
    <div id="divEditMode" visible="false" runat="server"><%=FieldRenderer.Render(CurrentContextItem, "Image") %></div>
</article>