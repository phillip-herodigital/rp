<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RoleManager.aspx.cs" Inherits="Sitecore.Shell.Applications.Security.RoleManager.RoleManager" %>
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
    html body
    {
      overflow: hidden;
    }
  </style>
  <script type="text/javascript" language="javascript">
  
  function onDelete() {
    Roles.scHandler.deleteSelected();
  }
  
  function OnResize() {
    var doc = $(document.documentElement);
    var ribbon = $("RibbonContainer");
    var grid = $("GridContainer");
    
    grid.style.height = doc.getHeight() - ribbon.getHeight() + 'px';
    grid.style.width = doc.getWidth() + 'px';

    Roles.render();
    
    /* re-render again after some "magic amount of time" - without this second re-render grid doesn't pick correct width sometimes */
    setTimeout("Roles.render()", 150);
  }
  
  function Roles_onDoubleClick(sender, eventArgs) {
    scForm.postRequest("", "", "", "rolemanager:viewmembers");
  }
  
  function refresh() {
    Roles.scHandler.refresh();
  }
  
  window.onresize = OnResize;
  
  </script>
  
</head>
<body style="background:transparent" id="PageBody" runat="server">
  <form id="RoleManagerForm" runat="server">
    <sc:AjaxScriptManager runat="server"/>
    <sc:ContinuationManager runat="server" />
    
    <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td id="RibbonContainer">
          <sc:Ribbon runat="server" ID="Ribbon" />
        </td>
      </tr>
    
      <tr>
        <td height="100%" id="GridCell" style="background:#e9e9e9">
          <sc:Border runat="server" ID="GridContainer">
          <ca:Grid id="Roles"
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
            
            ManualPaging ="true"
                        
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
                  <ca:GridColumn DataField="Name" Visible="false" />
                  <ca:GridColumn DataField="DisplayName" AllowSorting="false" AllowGrouping="false" IsSearchable="true" SortedDataCellCssClass="SortedDataCell" HeadingText="Role" />
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
                    <td><div style="padding:4px;font:8pt tahoma;white-space:nowrap;overflow:hidden">## DataItem.GetMember('Name').Value ##</div></td>
                  </tr>
                  <tr>
                    <td style="height:14px;background-color:#666666;padding:1px 8px 1px 8px;color:white">
                    ## DataItem.PageIndex + 1 ## / ## Roles.PageCount ##
                    </td>
                  </tr>
                </table>
              </ca:ClientTemplate>
            </ClientTemplates>
          </ca:Grid>
          </sc:Border>
        </td>
      </tr>
    </table>
  </form>
</body>
</html>
