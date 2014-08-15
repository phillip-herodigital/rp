namespace Sitecore.Speak.WebSite.layouts.Speak.Sublayouts
{
  using System;
  using System.Web.UI.WebControls;
  using Sitecore.Data.Items;
  using Sitecore.Diagnostics;
  using Sitecore.Web;

  /// <summary>
  /// Defines the forgot password class.
  /// </summary>
  public partial class ForgotPassword : System.Web.UI.UserControl
  {
    #region Constants and Fields

    /// <summary>
    /// The original user name
    /// </summary>
    private string originalUserName;

    /// <summary>
    /// Gets the data item.
    /// </summary>
    protected Item DataItem { get; private set; }

    #endregion

    #region Methods

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"/> event.
    /// </summary>
    /// <param name="e">
    /// An <see cref="T:System.EventArgs"/> object that contains the event data.
    /// </param>
    protected override void OnPreRender(EventArgs e)
    {
      base.OnPreRender(e);
      this.PasswordRecovery.MailDefinition.Subject = this.DataItem["Subject"];

      if (!string.IsNullOrEmpty(this.originalUserName))
      {
        this.PasswordRecovery.UserName = this.originalUserName;
      }
    }

    /// <summary>
    /// Called when the send has email.
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.Web.UI.WebControls.MailMessageEventArgs"/> instance containing the event data.
    /// </param>
    protected void OnSendEmail(object sender, MailMessageEventArgs e)
    {
      Assert.ArgumentNotNull(sender, "sender");
      Assert.ArgumentNotNull(e, "e");
      MainUtil.SendMail(e.Message);
      e.Cancel = true;
    }

    /// <summary>
    /// Called when the verifying has user.
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.Web.UI.WebControls.LoginCancelEventArgs"/> instance containing the event data.
    /// </param>
    protected void OnVerifyingUser(object sender, LoginCancelEventArgs e)
    {
      if (!Page.IsValid)
      {
        e.Cancel = true;
        return;
      }

      this.originalUserName = this.PasswordRecovery.UserName;
      this.PasswordRecovery.UserName = WebUtil.HandleFullUserName(this.PasswordRecovery.UserName);
    }

    /// <summary>
    /// Called when the return to has default.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void OnReturnToDefault(object sender, EventArgs e)
    {
      this.PasswordRecovery.SuccessPageUrl = Sitecore.Context.Site.VirtualFolder;
    }

    /// <summary>
    /// Called when the cancel button has click.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void OnCancelButtonClick(object sender, EventArgs e)
    {
      this.Page.Response.Redirect(this.ResolveClientUrl(Sitecore.Context.Site.VirtualFolder), false);
    }

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.Init"/> event to initialize the page.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"/> that contains the event data.</param>
    protected override void OnInit(EventArgs e)
    {
      base.OnInit(e);
      var sublayout = (Sitecore.Web.UI.WebControls.Sublayout)this.Parent;
      this.DataItem = Sitecore.Context.Database.GetItem(sublayout.DataSource);
      this.PasswordRecovery.DataBind();
    }

    #endregion
  }
}