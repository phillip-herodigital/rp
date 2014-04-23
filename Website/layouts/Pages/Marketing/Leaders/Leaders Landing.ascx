<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Leaders Landing.ascx.cs" Inherits="Website.layouts.Pages.Marketing.Leaders.Leaders_Landing" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<%@ Register TagPrefix="cus" TagName="LeaderListing" Src="Leader Listing.ascx" %>

<article class="marketing leaders">
	<div class="paragraph">
		<%=FieldRenderer.Render(CurrentContextItem, "Intro Text") %>
	</div>
	<div class="director-banner stretch">
		<h2 class="wrapper"><%=FieldRenderer.Render(CurrentContextItem, "Presidential Directors Header") %></h2>
	</div>
	<div class="wrapper">
		<cus:LeaderListing id="cusPresidentialDirectors" runat="server" />
		<p class="view-all"><%=FieldRenderer.Render(CurrentContextItem, "Presidential Directors Link") %></p>
	</div>
</article>
<article class="marketing leaders">
	<div class="director-banner stretch">
		<h2 class="wrapper"><%=FieldRenderer.Render(CurrentContextItem, "Executive Directors Header") %></h2>
	</div>
	<div class="wrapper">
		<cus:LeaderListing id="cusExecutiveDirectors" runat="server" />
		<p class="view-all"><%=FieldRenderer.Render(CurrentContextItem, "Executive Directors Link") %></p>
	</div>
</article>