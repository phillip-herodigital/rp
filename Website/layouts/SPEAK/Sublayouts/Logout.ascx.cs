namespace Sitecore.Speak.WebSite.layouts.Speak.Sublayouts {
  using System;
  using System.Web;
  using Sitecore.Data.Items;
  using Sitecore.Pipelines;
  using Sitecore.Pipelines.Logout;
  using Sitecore.Speak.Utils;

  /// <summary>
  /// Defines the logout sublayout class.
  /// </summary>
  public partial class LogoutSublayout : System.Web.UI.UserControl 
  {
    /// <summary>
    /// Called when the logged has out.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void OnLoggedOut(object sender, EventArgs e)
    {
      Pipeline.Start("logoutExt", new LogoutArgs());
      HttpContext.Current.Response.Redirect(Sitecore.Context.Site.VirtualFolder, true);
    }

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.Load"/> event.
    /// </summary>
    /// <param name="e">The <see cref="T:System.EventArgs"/> object that contains the event data.</param>
    protected override void OnLoad(EventArgs e)
    {
      base.OnLoad(e);

      if (Sitecore.Context.Database != null)
      {
        Item logoutItem = Sitecore.Context.Database.GetItem(IDs.LogoutItem);
        if (logoutItem != null)
        {
          this.LoginStatus.LogoutText = logoutItem["Text"];
        }
      }

      if (this.Context.User.Identity.IsAuthenticated)
      {
        this.LoginName.Text = string.IsNullOrEmpty(Sitecore.Context.User.Profile.FullName) ? Sitecore.Context.User.LocalName : Sitecore.Context.User.Profile.FullName;
      }
    }
  }
}