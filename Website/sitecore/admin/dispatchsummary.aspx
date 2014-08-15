<%@ Page Language="C#" AutoEventWireup="true" ClassName="Sitecore.Modules.EmailCampaign.UI.DispatchSummaryPage"
    Inherits="Sitecore.Modules.EmailCampaign.UI.DispatchSummary" %>

<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Import Namespace="Sitecore.Modules.EmailCampaign.Core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Active Dispatch Sessions</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <style type="text/css">
        .general
        {
            font-family: Verdana;
            font-size: xx-small;
            vertical-align: top;
            width: 100%;                         
            border-style:ridge;        
        }                                    
        
        .column1
        {
            border-bottom: 2px solid black;
            border-top: 2px solid black;
            border-left: 2px solid black;
            border-right-width:0px;
            border-style:ridge;
    
        }
        
        .column2
        {
            border-bottom: 2px solid black;
            border-top: 2px solid black;
            border-right: 2px solid black;
            border-left-width:0px;
            border-style:ridge;
     
        }
        
        .column3
        {
            border-bottom: 2px solid black;
            border-top: 2px solid black;
            border-left: 2px solid black;
            border-right-width:0px;
            border-style:ridge;
     
        }
        
        .column4
        {
            border-bottom: 2px solid black;
            border-top: 2px solid black;
            border-right: 2px solid black;
            border-left-width:0px;
            border-style:ridge;
  
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <table id="Table1" runat="server" class="general" >
        <tr>
            <td>
                <table>
                    <tr>
                        <td>
                            <%=Translate.Text(EcmTexts.CpuCores)%>
                        </td>
                        <td id="ProcessorCount" runat="server">
                            {1}
                        </td>
                    </tr>
                    <tr>
                        <td id="Td1" runat="server">
                            <%=Translate.Text(EcmTexts.AutomationStateBulkFetch) %>
                        </td>
                        <td id="RecipientsRequestSize" runat="server">
                            {2}
                        </td>
                    </tr>
                    <tr>
                        <td id="Td2" runat="server">
                            <%=Translate.Text(EcmTexts.CpuUsage) %>
                        </td>
                        <td runat="server" id="AverageCpuUsage">
                        </td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td>
                            <%=Translate.Text(EcmTexts.NumberOfThreads) %>
                        </td>
                        <td id="MaxThreads" runat="server">
                            {5}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <%=Translate.Text(EcmTexts.MaxGeneratingThreads) %>
                        </td>
                        <td id="MaxGenerationThreads" runat="server">
                            {5}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <%=Translate.Text(EcmTexts.MaxSmtpConnections) %>
                        </td>
                        <td id="MaxSmtpConnections" runat="server">
                            {6}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <%=Translate.Text(EcmTexts.SendEmulationTime) %>
                        </td>
                        <td colspan="8" id="EmulationSendTimeMinMax" runat="server">
                            [{7} ... {8}]
                            <%#Translate.Text(EcmTexts.Millisecond) %>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <br />
    <div style="height: 800px; overflow: auto;">
        <asp:gridview id="GridView1" runat="server" autogeneratecolumns="False" enablemodelvalidation="True"
            showheader="False" width="100%" border="0">
            <columns>
            <asp:TemplateField>
            <ItemTemplate>
   <table class="general">
          <tr >
           <td > 
            <table align="center" width="100%">
            <tr>
            <td>
            <table >
              <tr><td id="MessageName"  ><%#Translate.Text(EcmTexts.Message) %></td> <td id="dispatchMessageListName"><%#Eval("DispatchName")%> </td></tr> 
              <tr><td><%#Translate.Text(EcmTexts.StartTime) %></td><td id="ProcessingTimeStarted"> <%#Eval("ProcessingTimeStarted")%> </td></tr>
              <tr><td><%#Translate.Text(EcmTexts.Duration) %></td><td id="ProcessingDuration"> <%#Eval("ProcessingDuration")%> </td></tr>
            </table>
            </td>
            </tr>

              
              <tr> <td >
              <table width="100%"  style="border-collapse:collapse;"  >
               <tr style="font-weight:bold;" >
                <td class="column1" style="padding:2px;"><%#Translate.Text(EcmTexts.FetchAutomationStates) %></td>                
                <td class="column2" style="padding:2px;"><%#Translate.Text(EcmTexts.FetchRecipient) %></td>
                <td class="column3" style="padding:2px;"><%#Translate.Text(EcmTexts.GenerateSingleEmail) %></td>                
                <td class="column4" style="padding:2px;"><%#Translate.Text(EcmTexts.SendEmail) %></td>
            </tr>
            <tr >
            <td valign="top" class="column1">
            <table class="blank" >
              <tr >
               <td ><%#Translate.Text(EcmTexts.Total) %></td> 
               <td id="SumAutomationMilliseconds" ><%#Eval("AvgSumAutomationTime")%> <%#Translate.Text(EcmTexts.Millisecond) %></td>           
             </tr>
             <tr > 
               <td><%#Translate.Text(EcmTexts.Lock) %></td> 
                 <td id="AvgAutomationWaitTotalMilliseconds" ><%#Eval("AvgAutomationWait")%> <%#Translate.Text(EcmTexts.Millisecond) %></td>                  
             </tr>
             <tr >
                <td><%#Translate.Text(EcmTexts.Process) %></td>
               <td id="AvgAutomationFetchedTotalMilliseconds" > <%#Eval("AvgAutomationFetched")%> <%#Translate.Text(EcmTexts.Millisecond) %></td>                         
             </tr>

            </table>
            </td>
            <td valign="top" class="column2">
            <table  class="blank">
            <tr>
               <td><%#Translate.Text(EcmTexts.Wait) %></td> 
                 <td><%#Translate.Text(EcmTexts.N_A) %></td> 
            </tr>
            <tr>
             <td><%#Translate.Text(EcmTexts.Process) %></td> 
               <td id="AvgLoadUserTimeTotalMilliseconds">  <%#Eval("AvgLoadUserTime")%> <%#Translate.Text(EcmTexts.Millisecond) %></td>
            </tr>
            </table>
            </td>
            <td valign="top" class="column3">
            <table class="blank" >
            <tr>
                <td><%#Translate.Text(EcmTexts.Total) %></td> 
               <td id="SumGenerationSendMiliseconds">  <%#Eval("SumGenerationSend")%>  <%#Translate.Text(EcmTexts.Millisecond) %></td>
           </tr>
           <tr>
                <td><%#Translate.Text(EcmTexts.Wait) %></td> 
               <td id="AvgTaskWaitTimeTotalMilliseconds">  <%#Eval("AvgTaskWaitTime")%>  <%#Translate.Text(EcmTexts.Millisecond) %></td>
           </tr>
         <tr>
           <td valign="top"><%#Translate.Text(EcmTexts.Process) %></td> 
               <td id="AvgProcessTimeDetails" >
                 <%#Eval("AvgProcessTime")%> <%#Translate.Text(EcmTexts.Millisecond) %><br />
                 <%#Translate.Text(EcmTexts.LoadUser) %>  <%#Eval("AvgLoadUserTime")%> <%#Translate.Text(EcmTexts.Millisecond) %><br />
                 <%#Translate.Text(EcmTexts.GetPage) %>  <%#Eval("AvgGetPageTime")%> <%#Translate.Text(EcmTexts.Millisecond) %><br />
                 <%#Translate.Text(EcmTexts.CollectFiles) %>  <%#Eval("AvgCollectFilesTime")%> <%#Translate.Text(EcmTexts.Millisecond) %><br />
                 <%#Translate.Text(EcmTexts.GenerateMime) %>  <%#Eval("AvgGenerateMimeTime")%> <%#Translate.Text(EcmTexts.Millisecond) %><br />
               </td> 
            </tr>
            </table>            
            </td>
            <td valign="top" class="column4">
            <table class="blank">
         <tr>
               <td><%#Translate.Text(EcmTexts.FailedSendAttempts) %></td>
               <td><%#Eval("FailedSendAttempts")%></td>
             </tr>
             <tr>
               <td><%#Translate.Text(EcmTexts.Wait) %></td>  
               <td id="AvgSendMailWaitTotalMilliseconds">  <%#Eval("AvgSendMailWait")%>  <%#Translate.Text(EcmTexts.Millisecond) %></td> 
               
             </tr>
             <tr> 
             
               <td><%#Translate.Text(EcmTexts.Process) %></td> 
                 <td id="AvgSendTimeTotalMilliseconds" > <%#Eval("AvgSendTime")%>  <%#Translate.Text(EcmTexts.Millisecond) %></td>
               
             </tr>
            </table>
            </td>
            </tr>
              <tr>
              <td>
              <table class="blank">
                <tr><td id="AutomationStateFetchedPerSecond" ><%#Translate.Text(EcmTexts.FetchingSpeed) %></td><td>  <%#Eval("AutomationStateFetchedPerSecond")%>  <%#Translate.Text(EcmTexts.States) %></td>                   
                </tr>
                <tr> <td><%#Translate.Text(EcmTexts.Sending) %></td><td>  <%#Eval("ServerSendingMailsPerSecond")%>  <%#Translate.Text(EcmTexts.EmailsOnThisServer) %></td> </tr>
                <tr>  <td ><%#Translate.Text(EcmTexts.TotalMailsSent) %></td><td>  <%#Eval("MessagesProcessed")%>  <%#Translate.Text(EcmTexts.OnThisServer) %></td> </tr>
                </table>
              
              </td>
              <td id="RecipientsFetchedPerSecond" ><%#Translate.Text(EcmTexts.Fetching) %>  <%#Eval("RecipientsFetchedPerSecond")%>  <%#Translate.Text(EcmTexts.Recipents) %></td>     
              <td id="GeneratingMailsPerSecond" ><%#Translate.Text(EcmTexts.Generating) %>  <%#Eval("GeneratingMailsPerSecond")%>  <%#Translate.Text(EcmTexts.EmailContents) %></td>

              <td>
              <table class="blank">
              <tr>
              <td><%#Translate.Text(EcmTexts.Sending) %></td><td id="SendingMailsPerSecond" >  <%#Eval("SendingMailsPerSecond")%>  <%#Translate.Text(EcmTexts.Emails) %></td>
              </tr>
              <tr>
              <td><%#Translate.Text(EcmTexts.RequiredBandwidth) %> </td><td>  <%#Eval("BandwidthKbPerSecond")%>  <%#Translate.Text(EcmTexts.KBs) %></td>
              </tr>
              </table>
              </td>
              
              </tr>
              
              </table></td></tr>
             
            </table>
           </td>
     </tr>    
     
   </table>
            </ItemTemplate>

            </asp:TemplateField>
        </columns>
        </asp:gridview>
    </div>
    </form>
</body>
</html>
