<%@ Page AutoEventWireup="true" Inherits="Sitecore.Shell.Applications.Media.UploadManager.ResultPage" Language="C#" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html >
<head runat="server">
  <title>Sitecore</title>
  <sc:Head runat="server" />
  <sc:Script runat="server" Src="/sitecore/shell/Controls/Sitecore.Runtime.js"/>
  <sc:Script runat="server" Src="/sitecore/shell/Applications/Media/UploadManager/Result.aspx.js"/>
  
  <style type="text/css">
    body { 
      background:#e9e9e9; 
      overflow:hidden;
    }
    #Form {
        height: 100%;
    }
    #Grid { 
      height:100% 
    }
    #FileListCell { 
      height:100%; vertical-align:top 
    }
    #FileList { 
      background:white; border:1px #eeeeee inset; height:100%; width:100%; overflow:auto; 
    }
    #FileList a, #FileList a:link, #FileList a:visited, #FileList a:hover, #FileList a:active{  
      cursor:default;
      display:inline-block;
      *display:inline;
      padding: 5px;
      text-decoration:none;
      width:196px;
      vertical-align:top;
    }
    #FileList a:hover, #FileList a:active{  
      background:#c4dcff;
      border:1px solid #aecaef;
      padding: 4px;
    }
    
    #Buttons { 
      text-align:right;
      position:absolute;
      bottom:0;
      height: 30px;
      width: 100%;
    }
    
    #CloseButton {
      margin-right: 5px;
    }
    
    .scMediaIcon {
      width:48px;
      height:48px;
      float:left;
      margin:0px 4px 0px 0px;
      vertical-align:middle;
      border:1px solid #999999;
    }
    
    .scMediaTitle {
      font-weight:bold;
      overflow: hidden;
      width: 100%;
    }
    
    .scMediaDetails {
      padding:4px 0px 0px 0px;
      color:#666666;
    }
    
    .scMediaValidation {
      padding:2px 0px 0px 0px;
      color:red;
    }
         
    #FileList {
        margin-top: 7px;
    }
    
    /* Hide from IE in quirks mode*/
    html>body #FileList a:hover .scMediaTitle {
      overflow-x: auto;
    }
    
    .scMediaInfo {
      overflow: hidden;
      *width: 100%;
    }
        
    .FileListWrapper {
        width: 100%;
        height: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding: 5px 5px 60px 5px;
    }
    
  </style>
  
</head>
<body>
  <form id="Form" runat="server">
      <div class="FileListWrapper">
        <sc:Literal runat="server" Text="Uploaded Media Items:"/>
        <div id="FileList" runat="server"></div>
      </div>
      <div id="Buttons">
        <button id="CloseButton" onclick="javascript:return window.top.dialogClose();" style="font:8pt tahoma;height:24px;width:75px">
            <sc:Literal runat="server" Text="Close"/>
        </button>
      </div>
  </form>
</body>
</html>
