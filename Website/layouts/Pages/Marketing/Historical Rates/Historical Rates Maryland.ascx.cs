using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Website.layouts.Pages.Marketing.Historical_Rates
{
    public partial class historical_rates_maryland : BaseLayout
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            rptElectricityMonthToMonthRates.DataSource = Sitecore.Context.Item.Children["Electricity Month-to-Month Rates"].Children.OrderByDescending(C => C.Fields["Date"].Value);
            rptElectricityMonthToMonthRates.ItemDataBound += rptPlan_ItemDataBound;
            rptElectricityMonthToMonthRates.DataBind();
            
            rptElectricityGreenAndCleanMonthToMonthRates.DataSource = Sitecore.Context.Item.Children["Electricity Green and Clean Month-to-Month Rates"].Children.OrderByDescending(C => C.Fields["Date"].Value);
            rptElectricityGreenAndCleanMonthToMonthRates.ItemDataBound += rptPlan_ItemDataBound;
            rptElectricityGreenAndCleanMonthToMonthRates.DataBind();

            rptGasMonthToMonthRates.DataSource = Sitecore.Context.Item.Children["Gas Month-to-Month Rates"].Children.OrderByDescending(C => C.Fields["Date"].Value);
            rptGasMonthToMonthRates.ItemDataBound += rptPlan_ItemDataBound;
            rptGasMonthToMonthRates.DataBind();
        }

        void rptPlan_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            var item = e.Item.DataItem as Item;
            var table = e.Item.FindControl("table") as HtmlTable;
            var tdDate = e.Item.FindControl("tdDate") as HtmlTableCell;

            table.Attributes["class"] = (e.Item.ItemIndex % 2 == 0) ? "alt" : "";
            tdDate.InnerHtml = FieldRenderer.Render(item, "Date", "format=M/d/yyyy");

            var list = new List<KeyValuePair<string, string>>()
            {
                new KeyValuePair<string, string>("tdBGEPrice", "BGE Price"),
                new KeyValuePair<string, string>("tdPEPCOPrice", "PEPCO Price"),
                new KeyValuePair<string, string>("tdDelmarvaPrice", "Delmarva Price"),
            };

            foreach(var kvp in list)
            {

                var control = e.Item.FindControl(kvp.Key);
                if (control != null) 
                {
                    var td = control as HtmlTableCell;
                    td.InnerHtml = FieldRenderer.Render(item, kvp.Value);
                    td.InnerHtml += (!td.InnerHtml.Contains("-") && !string.IsNullOrEmpty(td.InnerHtml)) ? "&cent;" : "";
                    td.Visible = !string.IsNullOrEmpty(td.InnerHtml);
                }
            }
        }
    }
}