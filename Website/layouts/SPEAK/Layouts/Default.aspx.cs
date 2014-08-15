namespace Sitecore.Speak.WebSite
{
  using System;
  using System.Web;
  using Sitecore.Speak.Utils;
  using Sitecore.Data.Items;
  using Sitecore.Pipelines;
  using Sitecore.Pipelines.Logout;

  /// <summary>
  /// Defines the default class.
  /// </summary>
  public partial class Default : System.Web.UI.Page
  {
    /// <summary>
    ///  The name of the application.
    /// </summary>
    private string applicationName = string.Empty;

    /// <summary>
    /// Gets the name of the application.
    /// </summary>
    /// <value>
    /// The name of the application.
    /// </value>
    protected virtual string ApplicationName
    {
      get
      {
        if (string.IsNullOrEmpty(this.applicationName))
        {
          this.applicationName = Sitecore.Context.Database.GetItem(Sitecore.Context.Site.ContentStartPath)["title"];
        }

        return this.applicationName;
      }
    }

    /// <summary>
    /// Gets the application start.
    /// </summary>
    protected virtual string ApplicationStart
    {
      get
      {
        return (!string.IsNullOrEmpty(Sitecore.Context.Site.VirtualFolder)) ? Sitecore.Context.Site.VirtualFolder : "/";
      }
    }


    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.Init"/> event to initialize the page.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"/> that contains the event data.</param>
    protected override void OnInit(EventArgs e)
    {
      base.OnInit(e);
      HttpContext.Current.Handler = this.Page;
    }
  }
}