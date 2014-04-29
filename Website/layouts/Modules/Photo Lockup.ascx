<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Photo Lockup.ascx.cs" Inherits="Website.layouts.Modules.Photo_Lockup" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing photoLockup <%=ModuleCssClasses %>">
	<div class="photo" style="background-image: url('<%=BackgroundImageURL %>')">
        <div id="divEditMode" visible="false" runat="server">
            <%=FieldRenderer.Render(CurrentContextItem, "Background Image") %>
        </div>
	</div>
	<div class="text">
		<div class="inner">
			<h2 id="h2Header" runat="server"><%=FieldRenderer.Render(CurrentContextItem, "Header") %></h2>
			<h3 id="h3Header" runat="server"><%=FieldRenderer.Render(CurrentContextItem, "Sub Header") %></h3>
			<blockquote id="blkQuote" runat="server">
				<p><%=FieldRenderer.Render(CurrentContextItem, "Quote") %></p>
			</blockquote>
			<p class="cite" id="pCite" runat="server">&mdash; <%=FieldRenderer.Render(CurrentContextItem, "Citation") %></p>
			<p id="pContent" runat="server"><%=FieldRenderer.Render(CurrentContextItem, "Content") %></p>
            <%=FieldRenderer.Render(CurrentContextItem, "Button") %>
		</div>
	</div>
</article>