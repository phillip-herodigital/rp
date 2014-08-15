// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Login.ascx.cs" company="Sitecore A/S">
//   Copyright (c) Sitecore A/S. All rights reserved.
// </copyright>
// <summary>
//   Defines the Login class.
// </summary>
// --------------------------------------------------------------------------------------------------------------------
namespace Sitecore.Speak.WebSite.layouts.Speak.Sublayouts
{
  using System;
  using System.Web.UI;
  using System.Web.UI.WebControls;

  using Sitecore.Data.Fields;
  using Sitecore.Data.Items;
  using Sitecore.Links;
  using Sitecore.Pipelines;
  using Sitecore.Pipelines.LoggedIn;
  using Sitecore.Security.Accounts;
  using Sitecore.Speak.Utils;
  using Sitecore.Web;
  using Sitecore.Web.UI.WebControls;

  /// <summary>
  /// Defines the login class.
  /// </summary>
  public partial class Login : UserControl
  {
    #region Constants and Fields

    /// <summary>
    /// The original user name
    /// </summary>
    private string originalUserName;

    #endregion

    #region Methods

    /// <summary>
    /// Called when [authenticate].
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.Web.UI.WebControls.AuthenticateEventArgs"/> instance containing the event data.
    /// </param>
    protected void OnAuthenticate(object sender, AuthenticateEventArgs e)
    {
    }

    /// <summary>
    /// Called when the logged has in.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void OnLoggedIn(object sender, EventArgs e)
    {
      Pipeline.Start("loggedin", new LoggedInArgs { Username = this.UserLogin.UserName, Persist = this.UserLogin.RememberMeSet, StartUrl = this.GetStartUrl(Sitecore.Context.User) });
    }

    /// <summary>
    /// Called when the logging has in.
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.Web.UI.WebControls.LoginCancelEventArgs"/> instance containing the event data.
    /// </param>
    protected void OnLoggingIn(object sender, LoginCancelEventArgs e)
    {
      this.originalUserName = this.UserLogin.UserName;
      this.UserLogin.UserName = WebUtil.HandleFullUserName(this.UserLogin.UserName);

      this.UserLogin.DestinationPageUrl = this.GetStartUrl();
    }

    /// <summary>
    /// Called when the login has error.
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.EventArgs"/> instance containing the event data.
    /// </param>
    protected void OnLoginError(object sender, EventArgs e)
    {
      this.SetVisibilityOfFailureText(true);
    }

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"/> event.
    /// </summary>
    /// <param name="e">
    /// An <see cref="T:System.EventArgs"/> object that contains the event data.
    /// </param>
    protected override void OnPreRender(EventArgs e)
    {
      base.OnPreRender(e);
      if (!string.IsNullOrEmpty(this.originalUserName))
      {
        this.UserLogin.UserName = this.originalUserName;
      }
    }

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.Init"/> event to initialize the page.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"/> that contains the event data.</param>
    protected override void OnInit(EventArgs e)
    {
      base.OnInit(e);

      this.UserLogin.DataBind();

      this.SetVisibilityOfFailureText(false);
    }

    /// <summary>
    /// Gets the item URL.
    /// </summary>
    /// <param name="field">The field.</param>
    /// <returns>
    /// The item URL.
    /// </returns>
    protected string GetItemUrl(Data.Fields.Field field)
    {
      LinkField lf = new LinkField(field);


      Item item = null;
      if (lf.IsInternal)
      {
        item = Sitecore.Context.Database.GetItem(lf.TargetID);
      }

      if (item != null)
      {
        return LinkManager.GetItemUrl(item) + (!string.IsNullOrEmpty(lf.QueryString) ? "?" + lf.QueryString : string.Empty);
      }

      return string.Empty;
    }

    /// <summary>
    /// Sets the visibility of failure text.
    /// </summary>
    /// <param name="visible">if set to <c>true</c> [visible].</param>
    private void SetVisibilityOfFailureText(bool visible)
    {
      var failureTextControl = this.UserLogin.FindControl("FailureText");
      if (failureTextControl != null)
      {
        failureTextControl.Visible = visible;
      }
    }

    /// <summary>
    /// Gets the start URL.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <returns>
    /// The start URL.
    /// </returns>
    private string GetStartUrl(User user)
    {
      string str = WebUtil.GetCookieValue("sitecore_starturl");
      if (user != null)
      {
        str = !string.IsNullOrEmpty(user.Profile.StartUrl) ? user.Profile.StartUrl : str;
      }

      return !string.IsNullOrEmpty(str) ? str : this.GetStartUrl();
    }

    /// <summary>
    /// Gets the start URL.
    /// </summary>
    /// <returns>
    /// The start URL.
    /// </returns>
    private string GetStartUrl()
    {
      if (Helpers.Instance.Applications.Count == 1)
      {
        return LinkManager.GetItemUrl(Helpers.Instance.Applications[0].InnerItem);
      }

      return Sitecore.Context.Site != null ? Sitecore.Context.Site.VirtualFolder : "/speak/";
    }
    #endregion
  }
}