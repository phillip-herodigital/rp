<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Intro.ascx.cs" Inherits="Website.layouts.Modules.Intro" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing marketingIntro wrapper <%=ModuleCssClasses %>">

	<p class="intro"><%=FieldRenderer.Render(CurrentContextItem, "Intro") %></p>
	<hr />
	<div class="body">
		<%=FieldRenderer.Render(CurrentContextItem, "Body") %>

		<p><%=FieldRenderer.Render(CurrentContextItem, "Action Button") %></p>
	</div>
</article>