namespace Sitecore.Speak.WebSite.layouts.Speak.Layouts
{
  using System;
  using System.Web.UI;
  using Sitecore.Data;
  using Sitecore.Data.Items;
  using Sitecore.Speak.Utils;
  using Sitecore.Web.UI.WebControls;

  /// <summary>
  /// Defines the login page class.
  /// </summary>
  public partial class LoginPage : Page
  {
    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Page.PreInit"/> event at the beginning of page initialization.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"/> that contains the event data.</param>
    protected override void OnPreInit(EventArgs e)
    {
      base.OnPreInit(e);

      Item subLayuotItem;
      switch (this.Request.QueryString["mode"])
      {
        case "forgot":
          subLayuotItem = Sitecore.Context.Database.GetItem(IDs.ForgotPasswordSublayout);
          break;
        case "change":
          subLayuotItem = Sitecore.Context.Database.GetItem(IDs.ChangePasswordSublayout);
          break;
        default:
          subLayuotItem = Sitecore.Context.Database.GetItem(IDs.LoginSublayout);
          break;
      }

      if (subLayuotItem != null)
      {
        var sublayout = new Sublayout { DataSource = subLayuotItem["Datasource Location"] };
        sublayout.Controls.Add(this.Page.LoadControl(subLayuotItem["Path"]));

        this.MainPlaceholder.Controls.Add(sublayout);
      }
    }
  }
}
