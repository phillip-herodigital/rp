<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ForgotPassword.aspx.cs" Inherits="Sitecore.Speak.sitecore.login.Speak.ForgotPassword" %>
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
	<div id="jsLoginBox" class="sc-authenticationBox">
			<h1><img alt="Sitecore" src="/sitecore/shell/client/Speak/Assets/img/logo.png" /></h1>
			<p class="alert info">
			    <asp:Literal runat="server" ID="Header"/>                
			</p>
			<form action="/api/sitecore/Authentication/ForgotPassword?sc_database=master">
				<div class="sc-loading hidden jsloading">
					<img src="/sitecore/shell/client/Speak/Assets/img/sc-spinner16.gif" />
				</div>
                <fieldset id="confirmationFieldset" class="hidden">
                    <p class="alert info">
                       <label id="confirmationMessage"></label>
			        </p>
                    <div class="control-action">
						<div class="controls">
				            <button id="continueButton" tabindex="6"type="submit" class="btn"><%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.Continue) %></button>
			            </div>
                     </div>
                 </fieldset>
				<fieldset id="mainFieldset">
				    <div class="control-group">
						<label class="control-label" for="username"><%= ClientHost.Globalization.Translate(Texts.UserName) %></label>
						<div class="controls">
						  <input tabindex="1" type="text" name="username" id="inputUsername" placeholder="<%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.PleaseEnterYourUsername) %>">
						</div>
					</div>
					
					<div class="control-action">
						<div class="controls">
						  <button id="jsMainAction" tabindex="2"type="submit" class="btn"><%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.SendPassword) %></button>
						</div>
					</div>
					<div class="control-navigation">
						<nav class="back">
							<ul>
								<li>
									<a tabindex="3" href="/sitecore/login/SPEAK/Login.aspx">&larr; <%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.BackToLogin) %></a>
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
