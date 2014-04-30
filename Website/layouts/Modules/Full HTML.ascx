<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Full HTML.ascx.cs" Inherits="Website.layouts.Modules.Full_HTML" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing full-html <%=ModuleCssClasses %>">
	<div class="wrapper">
		<%=FieldRenderer.Render(CurrentContextItem, "Module HTML") %>
	</div>
</article>