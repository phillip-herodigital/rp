<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="FillDB.aspx.cs" Inherits="Sitecore.sitecore.admin.FillDB" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Fill DB</title>
    <link href="/sitecore/shell/themes/standard/default/WebFramework.css" rel="Stylesheet" />
    <link href="/sitecore/admin/Wizard/UpdateInstallationWizard.css" rel="Stylesheet" />

    <script type="text/javascript" src="/sitecore/shell/Controls/lib/jQuery/jquery.js"></script>

    <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
</head>
<body>
    <form id="form1" class="wf-container" runat="server">
        <div style="margin-top: 50px; margin-bottom: 10px; margin-left: 20px">

            <h1>Instructions</h1>
            <h2>Installation:</h2>
            <p><strong>Step 1 : </strong>Take the ItemGenerator.sql file in your '/sitecore/admin/SqlScripts' directory and run it against the master database through SQL Management Studio.</p>
            <p><strong>Step 2 : </strong>Create a "data" folder in your Website directory, and create a folder in that called "words" i.e. c:\sitename\Website\data\words</p>
            <p><strong>Step 3 : </strong>Place .txt files in here that contain large bodies of text e.g. a text version of a book  <a href="http://www.gutenberg.org/" target="blank">Gutenberg Books</a></p>
            <p><strong>Step 4 : </strong>Clear your site cache at /sitecore/admin/cache.aspx or reset IIS with 'iisreset' at a command line.</p>
        </div>
        <div style="margin-top: 50px; margin-bottom: 10px; margin-left: 20px">
            Parent Guid:
        </div>
        <div style="margin-left: 20px">
            <input type="text" runat="server" id="parentGuid" style="width: 600px" value="{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}" />
        </div>
        <div style="margin-top: 50px; margin-bottom: 10px; margin-left: 20px">
            Database Name:
        </div>
        <div style="margin-left: 20px">
            <input type="text" runat="server" id="database" style="width: 600px" value="master" />
        </div>
        <div style="margin-top: 50px; margin-bottom: 10px; margin-left: 20px">
            Number of items:
        </div>
        <div style="margin-left: 20px">
            <input type="text" runat="server" id="itemCount" style="width: 600px" value="100" />&nbsp;<asp:Button OnClick="ButtonClicked" runat="server" ID="goButton" Text="Go!" />
        </div>

        <asp:PlaceHolder runat="server" ID="placeholder" />
    </form>
</body>
</html>
