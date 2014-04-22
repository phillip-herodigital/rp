<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Login Horizontal.ascx.cs" Inherits="Website.layouts.Modules.Login_Horizontal" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing loginHorizontal" ng-controller="LoginHorizontalCtrl" ng-init="init('https://secure3.i-doxs.net/StreamEnergy/Default.aspx', 'https://secure3.i-doxs.net/StreamEnergyGA/Default.aspx')">
	<div class="wrapper">
		<span class="text"><%=FieldRenderer.Render(CurrentContextItem, "Header Text") %></span>
		<div class="group">
			<div class="item">
				<ul class="radio-list">
					<li><input type="radio" name="loginState" value="TX" id="loginState[texas]" ng-model="state" /> <label for="loginState[texas]"><%=FieldRenderer.Render(CurrentContextItem, "Texas Label") %></label></li>
					<li><input type="radio" name="loginState" value="GA" id="loginState[georgia]" ng-model="state" /> <label for="loginState[georgia]"><%=FieldRenderer.Render(CurrentContextItem, "Georgia Label") %></label></li>
				</ul>
			</div>
			<div class="item">
				<input type="text" name="username" placeholder="<%=CurrentContextItem.Fields["Username Placeholder"].Value %>" ng-model="username" />
			</div>
			<div class="item">
				<input type="password" name="password" placeholder="<%=CurrentContextItem.Fields["Password Placeholder"].Value %>" ng-model="password" />
			</div>
			<div class="item">
				<button type="button" ng-click="loginClicked()"><%=FieldRenderer.Render(CurrentContextItem, "Button Text") %></button>
			</div>
		</div>
	</div>
</article>