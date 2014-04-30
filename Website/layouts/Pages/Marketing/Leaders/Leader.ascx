<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Leader.ascx.cs" Inherits="Website.layouts.Pages.Marketing.Leaders.Leader" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing leader">
	<div class="wrapper">
        <p class="img"><%=FieldRenderer.Render(CurrentContextItem, "Image") %></p>
        <h1><%=FieldRenderer.Render(CurrentContextItem, "First Name") %> <%=FieldRenderer.Render(CurrentContextItem, "Last Name") %></h1>

		<h2><%=FieldRenderer.Render(CurrentContextItem, "Location") %></h2>
        <%=FieldRenderer.Render(CurrentContextItem, "Description") %>
	</div>
</article>