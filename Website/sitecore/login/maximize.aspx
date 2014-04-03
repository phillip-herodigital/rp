<%@ Page
    Language="C#"
    AutoEventWireup="true"
    CodeBehind="maximize.aspx.cs"
    Inherits="Sitecore.sitecore.login.MaximizePage" %>
<%@ OutputCache
    Location="None"
    VaryByParam="none"
%><?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

  <head>

    <title>Sitecore</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

    <script type="text/javascript">
      <asp:Literal runat="server" ID="startScriptLiteral"/>
    </script>

  </head>

  <body>

    <div style="padding: 64px 0 0 0; text-align: center">

      <h1>This window is no longer used.</h1>
      <h2>You can safely close it...</h2>
      <asp:Literal runat="server" ID="closeButtonLiteral"/>

      <h2>or</h2>

      <div style="padding: 16px 0 0 0; text-align: center">
        <button onclick="javascript: location.href='/sitecore/login'">Login to Sitecore</button>
      </div>

    </div>

  </body>

</html>