<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ConvertUsersToContacts.aspx.cs" Inherits="Sitecore.sitecore.admin.ConvertUsersToContacts" %>

<!DOCTYPE html>
<html>
<head id="Head1" runat="server">
    <title>Convert users to contacts</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    
     <style type="text/css">
        .wf-container
        {
            min-width: 950px;
            display: inline-block;
            width: auto;
        }

        .wf-content
        {
            padding: 2em 2em;
        }
     </style>
</head>
<body>
  <form id="mainForm" runat="server" class="wf-container">
      <div class="wf-content">  
          <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
          <asp:Timer ID="ProgressTimer" Interval="4000" runat="server" OnTick="ProgressTimer_Tick"></asp:Timer>
          <asp:UpdatePanel ID="UpdatePanel1" runat="server">
               <ContentTemplate>
                   <div>
                        <span>Status: </span><asp:Label ID="lblProcessingStatus" runat="server"></asp:Label>
                   </div>
                   <asp:Button runat="server" ID="btnGo" Text="Convert" OnClick="ButtonGo_Click" />
               </ContentTemplate>
           </asp:UpdatePanel>
       </div>
  </form>
</body>
</html>