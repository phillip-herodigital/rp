<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ChangePassword.aspx.cs" Inherits="Sitecore.Speak.sitecore.login.Speak.ChangePassword" %>
<%@ Import Namespace="Sitecore" %>
<%@ Import Namespace="Sitecore.Names" %>
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
			<form action="/api/sitecore/Authentication/ChangePassword?sc_database=master">
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
						<label class="control-label" for="inputUserName"><%= ClientHost.Globalization.Translate(Sitecore.Texts.UserName)%></label>
						<div class="controls">
						  <input tabindex="1" type="text" name="username" id="inputUserName" placeholder="<%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.PleaseEnterYourUsername) %>">
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputOldPassword"><%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.OldPassword)%></label>
						<div class="controls">
						  <input tabindex="2" type="password" name="oldPassword" id="inputOldPassword" placeholder="<%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.PleaseEnterYourCurrentPassword) %>">
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputNewPassword"><%= ClientHost.Globalization.Translate(Sitecore.Texts.NewPassword) %></label>
						<div class="controls">
						  <input tabindex="3" type="password" name="newPassword" id="inputNewPassword" placeholder="<%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.PleaseEnterTheNewPasswordYouWishToUse) %>">
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputNewPassword2"><%= ClientHost.Globalization.Translate(Sitecore.Texts.ConfirmNewPassword) %></label>
						<div class="controls">
						  <input tabindex="4" type="password" name="newPassword2" id="inputNewPassword2" placeholder="<%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.PleaseConfirmTheNewPasswordYouWishToUse) %>">
						</div>
					</div>
					<div class="control-action">
						<div class="controls">
						  <button id="jsMainAction" tabindex="5"type="submit" class="btn"><%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.ChangePassword) %></button>
						</div>
					</div>
					<div class="control-navigation">
						<nav class="back">
							<ul>
								<li>
									<a tabindex="6" href="/sitecore/login/SPEAK/Login.aspx">&larr; <%= ClientHost.Globalization.Translate(Sitecore.Names.Texts.BackToLogin) %></a>
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
