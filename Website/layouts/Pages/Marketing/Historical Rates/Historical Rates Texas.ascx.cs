using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace StreamEnergy.MyStream.layouts.Pages.Marketing.Historical_Rates
{
    public partial class historical_rates_texas : BaseLayout
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            rptVariablePricePlan.DataSource = Sitecore.Context.Item.Children["Variable Price Plan"].Children.OrderByDescending(C => C.Fields["Date"].Value);
            rptVariablePricePlan.ItemDataBound += rptPlan_ItemDataBound;
            rptVariablePricePlan.DataBind();
            
            rptGreenAndCleanVariablePricePlan.DataSource = Sitecore.Context.Item.Children["Green and Clean Variable Price Plan"].Children.OrderByDescending(C => C.Fields["Date"].Value);
            rptGreenAndCleanVariablePricePlan.ItemDataBound += rptPlan_ItemDataBound;
            rptGreenAndCleanVariablePricePlan.DataBind();

            rptFlexChoicePlan.DataSource = Sitecore.Context.Item.Children["Flex Choice Plan"].Children.OrderByDescending(C => C.Fields["Date"].Value);
            rptFlexChoicePlan.ItemDataBound += rptPlan_ItemDataBound;
            rptFlexChoicePlan.DataBind();

            rptFlexChoicePlanGreenAndCleanPlan.DataSource = Sitecore.Context.Item.Children["Flex Choice Plan - Green and Clean Plan"].Children.OrderByDescending(C => C.Fields["Date"].Value);
            rptFlexChoicePlanGreenAndCleanPlan.ItemDataBound += rptPlan_ItemDataBound;
            rptFlexChoicePlanGreenAndCleanPlan.DataBind();
        }

        void rptPlan_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            var item = e.Item.DataItem as Item;
            var table = e.Item.FindControl("table") as HtmlTable;
            var tdDate = e.Item.FindControl("tdDate") as HtmlTableCell;

            table.Attributes["class"] = (e.Item.ItemIndex % 2 == 0) ? "alt" : "";
            tdDate.InnerHtml = FieldRenderer.Render(item, "Date", "format=M/d/yyyy");
            tdDate.ColSpan = (!string.IsNullOrEmpty(FieldRenderer.Render(item, "500 kWh Oncor Price"))) ? 3 : 1;

            var list = new List<KeyValuePair<string, string>>()
            {
                new KeyValuePair<string, string>("tdKwh500Label", "500 kWh Label"),
                new KeyValuePair<string, string>("tdKwh1000Label", "1000 kWh Label"),
                new KeyValuePair<string, string>("tdKwh2000Label", "2000 kWh Label"),
                new KeyValuePair<string, string>("tdKwh500OncorPrice", "500 kWh Oncor Price"),
                new KeyValuePair<string, string>("tdKwh1000OncorPrice", "1000 kWh Oncor Price"),
                new KeyValuePair<string, string>("tdKwh2000OncorPrice", "2000 kWh Oncor Price"),
                new KeyValuePair<string, string>("tdKwh500CenterpointPrice", "500 kWh Centerpoint Price"),
                new KeyValuePair<string, string>("tdKwh1000CenterpointPrice", "1000 kWh Centerpoint Price"),
                new KeyValuePair<string, string>("tdKwh2000CenterpointPrice", "2000 kWh Centerpoint Price"),
                new KeyValuePair<string, string>("tdKwh500AEPCentralPrice", "500 kWh AEP Central Price"),
                new KeyValuePair<string, string>("tdKwh1000AEPCentralPrice", "1000 kWh AEP Central Price"),
                new KeyValuePair<string, string>("tdKwh2000AEPCentralPrice", "2000 kWh AEP Central Price"),
                new KeyValuePair<string, string>("tdKwh500AEPNorthPrice", "500 kWh AEP North Price"),
                new KeyValuePair<string, string>("tdKwh1000AEPNorthPrice", "1000 kWh AEP North Price"),
                new KeyValuePair<string, string>("tdKwh2000AEPNorthPrice", "2000 kWh AEP North Price"),
                new KeyValuePair<string, string>("tdKwh500TNMPPrice", "500 kWh TNMP Price"),
                new KeyValuePair<string, string>("tdKwh1000TNMPPrice", "1000 kWh TNMP Price"),
                new KeyValuePair<string, string>("tdKwh2000TNMPPrice", "2000 kWh TNMP Price"),
            };

            foreach(var kvp in list)
            {
                var td = e.Item.FindControl(kvp.Key) as HtmlTableCell;
                td.InnerHtml = FieldRenderer.Render(item, kvp.Value);
                td.InnerHtml += (!kvp.Key.Contains("Label") && !string.IsNullOrEmpty(td.InnerHtml)) ? "&cent;" : "";
                td.Visible = !string.IsNullOrEmpty(td.InnerHtml);
            }
        }
    }
}