<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DomainManager.aspx.cs" Inherits="Sitecore.Shell.Applications.Security.DomainManager.DomainManager" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls.Ribbons" TagPrefix="sc" %>
<%@ Register Assembly="ComponentArt.Web.UI" Namespace="ComponentArt.Web.UI" TagPrefix="ca" %>
<!DOCTYPE html>

<html>
<head runat="server">
  <title>Sitecore</title>
  <sc:Stylesheet Src="Content Manager.css" DeviceDependant="true" runat="server" />
  <sc:Stylesheet Src="Ribbon.css" DeviceDependant="true" runat="server" />
  <sc:Stylesheet Src="Grid.css" DeviceDependant="true" runat="server" />
  <sc:Script Src="/sitecore/shell/Applications/Content Manager/Content Editor.js" runat="server" />
  
  <style type="text/css">
    .scDomainNameColumn {
      width: 75%;
    }

    html body
    {
      overflow: hidden;
    }

    #GridCell {
        background: #e9e9e9;
    }
  </style>
  
  <script type="text/javascript">
  
  function onDelete() {
    Domains.scHandler.deleteSelected();
  }
  
  function OnResize() {
    var doc = $(document.documentElement);
    var ribbon = $("RibbonContainer");
    var grid = $("GridContainer");
    
    grid.style.height = doc.getHeight() - ribbon.getHeight() + 'px';
    grid.style.width = doc.getWidth() + 'px';

    Domains.render();
    
    /* re-render again after some "magic amount of time" - without this second re-render grid doesn't pick correct width sometimes */
    setTimeout("Domains.render()", 150);
  }
  
  function refresh() {
    Domains.scHandler.refresh();
  }
  
  window.onresize = OnResize;
  
  </script>
  
</head>
<body style="background:transparent" id="PageBody" runat="server">
  <form id="DomainManagerForm" runat="server">
    <sc:AjaxScriptManager runat="server"/>
    <sc:ContinuationManager runat="server" />
    
    <div class="scFlexColumnContainer scHeight100">
        <div id="RibbonContainer">
            <sc:Ribbon runat="server" ID="Ribbon" />
        </div>
        <div id="GridCell" class="scFlexContent">
            <sc:Border runat="server" ID="GridContainer" Style="height:100%">
                <ca:Grid id="Domains" 
                         AutoFocusSearchBox="false"
                         RunningMode="Callback" 
                         CssClass="Grid"
                         FillContainer="true"
                         ShowHeader="true"
                         HeaderCssClass="GridHeader" 
            
                         FooterCssClass="GridFooter" 

                         GroupByText = ""
                         GroupingNotificationText = ""
                         GroupByCssClass="GroupByCell"
                         GroupByTextCssClass="GroupByText"
                         GroupBySortAscendingImageUrl="group_asc.gif"
                         GroupBySortDescendingImageUrl="group_desc.gif"
                         GroupBySortImageWidth="10"
                         GroupBySortImageHeight="10"

                         GroupingNotificationTextCssClass="GridHeaderText"
                         GroupingPageSize="5"
            
                         PagerStyle="Slider"
                         PagerTextCssClass="GridFooterText"
                         PagerButtonWidth="41"
                         PagerButtonHeight="22"
                         PagerImagesFolderUrl="/sitecore/shell/themes/standard/componentart/grid/pager/"
            
                         ShowSearchBox="true"
                         SearchTextCssClass="GridHeaderText"
                         SearchBoxCssClass="SearchBox"
      	    
                         SliderHeight="20"
                         SliderWidth="150" 
                         SliderGripWidth="9" 
                         SliderPopupOffsetX="20"
                         SliderPopupClientTemplateId="SliderTemplate" 
            
                         TreeLineImagesFolderUrl="/sitecore/shell/themes/standard/componentart/grid/lines/" 
                         TreeLineImageWidth="22" 
                         TreeLineImageHeight="19" 
            
                         PreExpandOnGroup="false"
                         ImagesBaseUrl="/sitecore/shell/themes/standard/componentart/grid/" 
                         IndentCellWidth="22" 

                         LoadingPanelClientTemplateId="LoadingFeedbackTemplate"
                         LoadingPanelPosition="MiddleCenter"
            
                         Width="100%" Height="100%" runat="server">
            
                    <Levels>
                        <ca:GridLevel
                            DataKeyField="scGridID"
                            ShowTableHeading="false" 
                            ShowSelectorCells="false" 
                            RowCssClass="Row" 
                            ColumnReorderIndicatorImageUrl="reorder.gif"
                            DataCellCssClass="DataCell" 
                            HeadingCellCssClass="HeadingCell" 
                            HeadingCellHoverCssClass="HeadingCellHover" 
                            HeadingCellActiveCssClass="HeadingCellActive" 
                            HeadingRowCssClass="HeadingRow" 
                            HeadingTextCssClass="HeadingCellText"
                            SelectedRowCssClass="SelectedRow"
                            GroupHeadingCssClass="GroupHeading" 
                            SortAscendingImageUrl="asc.gif" 
                            SortDescendingImageUrl="desc.gif" 
                            SortImageWidth="13" 
                            SortImageHeight="13">
                            <Columns>
                                <ca:GridColumn DataField="scGridID" Visible="false" />
                                <ca:GridColumn DataField="LocallyManaged" Visible="false" />
                                <ca:GridColumn DataField="Name" HeadingCellCssClass="scDomainNameColumn" AllowSorting="false" AllowGrouping="false" IsSearchable="true" SortedDataCellCssClass="SortedDataCell" HeadingText="Domain" />
                                <ca:GridColumn DataField="Comment" HeadingCellCssClass="scDomainNameColumn" AllowSorting="false" AllowGrouping="false" IsSearchable="false" SortedDataCellCssClass="SortedDataCell" HeadingText="Comment" />                  
                            </Columns>
                        </ca:GridLevel>
                    </Levels>
            
                    <ClientTemplates>
                        <ca:ClientTemplate Id="LoadingFeedbackTemplate">
                            <table cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="font-size:10px;"><sc:Literal Text="Loading..." runat="server" />;</td>
                                    <td><img src="/sitecore/shell/themes/standard/componentart/grid/spinner.gif" width="16" height="16" border="0"></td>
                                </tr>
                            </table>
                        </ca:ClientTemplate>
              
                        <ca:ClientTemplate Id="SliderTemplate">
                            <table class="SliderPopup" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td><div style="padding:4px;font:8pt tahoma;white-space:nowrap;overflow:hidden">## DataItem.GetMember('DisplayName').Value ##</div></td>
                                </tr>
                                <tr>
                                    <td style="height:14px;background-color:#666666;padding:1px 8px 1px 8px;color:white">
                                        ## DataItem.PageIndex + 1 ## / ## Domains.PageCount ##
                                    </td>
                                </tr>
                            </table>
                        </ca:ClientTemplate>
                    </ClientTemplates>
                </ca:Grid>
            </sc:Border>
        </div>
    </div>
  </form>
</body>
</html>
