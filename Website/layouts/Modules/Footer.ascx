<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Footer.ascx.cs" Inherits="Website.layouts.Modules.Footer" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<footer class="site-footer">
	<div class="super-footer">
		<div class="wrapper">
			<div class="grid three">
				<div class="col">
                    <%=FieldRenderer.Render(CurrentContextItem, "First Column Links") %>
				</div>
				<div class="col quick-links">
					<h2><i class="icon-quicklinks"></i> <%=FieldRenderer.Render(CurrentContextItem, "Quick Links Header") %></h2>
                    <%=FieldRenderer.Render(CurrentContextItem, "Quick Links") %>
				</div>
				<div class="col social">
					<h2><i class="icon-social"></i> <%=FieldRenderer.Render(CurrentContextItem, "Social Header") %></h2>
                    <%=FieldRenderer.Render(CurrentContextItem, "Social Links") %>
				</div>
			</div>
		</div>
	</div>
	<div class="wrapper copyright">
		<p><%=FieldRenderer.Render(CurrentContextItem, "Copyright Content") %></p>
		<ul>
			<li><a href="#"><i class="icon-bbb"></i></a></li>
			<li><a href="#"><i class="icon-dsa"></i></a></li>
		</ul>
	</div>
</footer>