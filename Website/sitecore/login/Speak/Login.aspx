<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="Sitecore.Speak.sitecore.login.Speak.Login" %>
<%@ Import Namespace="Sitecore" %>
<!DOCTYPE html>
<html>
 <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Sitecore Login Page</title>
    <meta name="description" content="Login into sitecore">
    <meta name="viewport" content="width=device-width">
    <link href="/sitecore/shell/client/Speak/Assets/css/Authentications/authentication.css" rel="stylesheet" />     
</head>
 <body>
	<noscript>
		<p class="error alert">You need to have javascript enable in order to use SITECORE.</p>
	</noscript>
		
	<div id="jsLoginBox" class="sc-authenticationBox">
		<h1><img alt="Sitecore" src="/sitecore/shell/client/Speak/Assets/img/logo.png" /></h1>
		<div class="sc-notifications hidden">
			<p class="alert hidden default error">Something went wrong with the login.</p>
		</div>
		<form action="/api/sitecore/Authentication/Login?sc_database=master">
		    <input type="hidden" name="domain" value="<%= Sitecore.Context.Domain.Name %>"/>
			<div class="sc-loading hidden jsloading">
				<img src="/sitecore/shell/client/Speak/Assets/img/sc-spinner16.gif" />
			</div>
			<fieldset>
				<div class="control-group">
					<label class="control-label" for="inputUserName"><%= ClientHost.Globalization.Translate(Texts.UserName) %></label>
					<div class="controls">
						<input tabindex="1" name="username" type="text" id="inputUserName" placeholder="<%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.PleaseEnterYourUsername) %>" />
					</div>
					<p class="small error"></p>
				</div>
				<div class="control-group">
					<label class="control-label" for="inputPassword"><%= ClientHost.Globalization.Translate(Texts.Password) %></label>
					<div class="controls">
						<input tabindex="2" name="password" type="password" id="inputPassword" placeholder="<%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.PleaseEnterYourPassword) %>">
					</div>
				</div>
				<div class="control-action">
					<div class="controls">
						<label class="checkbox">
						    <input tabindex="3" name="rememberme" type="checkbox"/>&nbsp;<%= ClientHost.Globalization.Translate(Texts.RememberMe) %>
						</label>
						<button id="jsMainAction" tabindex="4"type="submit" class="btn"><%= ClientHost.Globalization.Translate(Texts.Login) %></button>
					</div>
				</div>
				<div class="control-navigation">
					<nav class="nav">
						<ul>
							<li>
								<a tabindex="5" href="/sitecore/login/Speak/ForgotPassword.aspx"><%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.ForgotPassword) %></a>
							</li>
							<li>
								<a tabindex="6" href="/sitecore/login/Speak/ChangePassword.aspx"><%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.ChangePassword) %></a>
							</li>
						</ul>
					</nav>
				</div>
			</fieldset>
		</form>
	</div>
     <script src="/sitecore/shell/client/Speak/Assets/lib/core/deps/jQuery/jquery-1.9.1.min.js"></script>
     <script src="/sitecore/shell/client/Speak/Assets/lib/Authentications/authentication.js"></script>
</body>
</html>
