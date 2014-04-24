<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="View All Directors.ascx.cs" Inherits="Website.layouts.Pages.Marketing.Leaders.View_All_Directors" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<%@ Register TagPrefix="cus" TagName="LeaderListing" Src="Leader Listing.ascx" %>

<article class="marketing director-list">
	<div class="wrapper">
		<h2><%=FieldRenderer.Render(CurrentContextItem, "Page Header") %></h2>
		<cus:LeaderListing id="cusDirectors" runat="server" />
	</div>
</article>