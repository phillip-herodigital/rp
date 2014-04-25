<%@ Page AutoEventWireup="true" Inherits="Sitecore.Shell.Applications.Media.UploadManager.UploadPage" Language="C#" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html >
<head runat="server">
  <title>Sitecore</title>
  <sc:Head runat="server" />
  <sc:Script runat="server" Src="/sitecore/shell/Controls/Sitecore.Runtime.js"/>
  <sc:Script runat="server" Src="/sitecore/shell/Applications/Media/UploadManager/Upload.aspx.js"/>
  
  <style type="text/css">
    input { font:9pt verdana }
    body { background:#e9e9e9; height:100%;}
    form { height:100%; }
    #Grid { height:100% }
    #FileListCell { height:100%; vertical-align:top }
    #FileList { background:white; border:1px #eeeeee inset; height:100%; padding:4px; overflow: auto; margin-top: 7px; }
    #FileList input {  width:100%; }
    #Buttons { vertical-align:bottom }
    #HeadTable { background:white; position:relative }
    #OptionTableWrapper { position: relative; bottom: 110px; *bottom: 255px;width: 100%; margin-left: 5px; overflow: hidden; text-align:right;}
    #OptionTableWrapper table { white-space: nowrap;text-align: left;}
    #Upload { position: relative; font:8pt tahoma;height:24px;width:75px; margin-right:10px; *margin-right: 5px; }
    #FileListWrapper {width: 100%; height: 100%; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; padding: 5px 5px 150px 5px; }
    td label { white-space: nowrap;}
    
  </style>
  
</head>
<body>
  <form id="UploadForm" runat="server" enctype="multipart/form-data" target="SitecoreUpload">
    <input id="Uri" runat="server" name="Item" type="hidden" value="" />
    <input id="Folder" runat="server" name="Path" type="hidden" value="" />
    <input id="Uploading" runat="server" type="hidden" value="1" />
    <input id="UploadedItems" runat="server" type="hidden" value="" />
    <input id="UploadedItemsHandle" runat="server" type="hidden" value="" />
    <input id="ErrorText" runat="server" type="hidden" value="" />
    

        <table id="HeadTable" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td valign="top">
              <sc:ThemedImage runat="server" height="32" margin="4px 8px 4px 8px" src="Applications/32x32/folder_up.png" width="32"/>
            </td>
            <td valign="top" width="100%">
              <div style="padding:2px 16px 0px 0px">
                <div style="color:black;padding:0px 0px 4px 0px;font:bold 9pt tahoma">
                  <sc:Literal runat="server" Text="Batch Upload"/>
                </div>
                <div style="color:#333333">
                  <sc:Literal runat="server" Text="Uploads a number of files to the server."/>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <div class="scHorizontalLine">.</div>
              <div id="FileListWrapper">
                <sc:Literal runat="server" Text="Select the Files to Upload Here:"/>
                <div id="FileList">
                    <input id="File0" name="File0" type="file" value="browse" onchange="javascript:return Sitecore.Upload.change(this)"/>
                </div>
              </div>

            
        <div id="OptionTableWrapper">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <input id="Unpack" name="Unpack" type="checkbox" value="1" /><label for="Unpack"><sc:Literal runat="server" Text="Unpack ZIP Archives"></sc:Literal></label>
                </td>
                <td>
                  <input runat="server" id="Versioned" name="Versioned" type="checkbox" value="1" /><label for="Versioned"><sc:Literal runat="server" Text="Make Uploaded Media Items Versionable"></sc:Literal></label>
                </td>
              </tr>
              <tr>
                <td runat="server" id="OverwriteCell">
                  <input runat="server" id="Overwrite" name="Overwrite" type="checkbox" value="1" /><label for="Overwrite"><sc:Literal runat="server" Text="Overwrite Existing Media Items"></sc:Literal></label>
                </td>
                <td runat="server" id="AsFilesCell">
                  <input runat="server" id="AsFiles" name="AsFiles" type="checkbox" value="1" /><label for="AsFiles"><sc:Literal runat="server" Text="Upload as Files"></sc:Literal></label>
                </td>
              </tr>
            </table>
            <input id="Upload" type="Submit" value='<%= Translate.Text("Upload")  %>' />
        </div>
  </form>
</body>
</html>
