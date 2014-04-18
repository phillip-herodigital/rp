<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Login Horizontal.ascx.cs" Inherits="Website.layouts.Modules.Login_Horizontal" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing loginHorizontal">
	<div class="wrapper">
		<span class="text"><%=FieldRenderer.Render(CurrentContextItem, "Header Text") %></span>
		<form>
			<div class="group">
				<div class="item">
					<ul class="radio-list">
						<li><input type="radio" name="loginState" value="texas" id="loginState[texas]" checked="checked" /> <label for="loginState[texas]"><%=FieldRenderer.Render(CurrentContextItem, "Texas Label") %></label></li>
						<li><input type="radio" name="loginState" value="georgia" id="loginState[georgia]" /> <label for="loginState[georgia]"><%=FieldRenderer.Render(CurrentContextItem, "Georgia Label") %></label></li>
					</ul>
				</div>
				<div class="item">
					<input type="text" name="username" placeholder="<%=CurrentContextItem.Fields["Username Placeholder"].Value %>" />
				</div>
				<div class="item">
					<input type="password" name="password" placeholder="<%=CurrentContextItem.Fields["Password Placeholder"].Value %>" />
				</div>
				<div class="item">
					<button type="submit"><%=FieldRenderer.Render(CurrentContextItem, "Button Text") %></button>
				</div>
			</div>
		</form>
	</div>
</article>