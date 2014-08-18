namespace Sitecore.Speak.WebSite.layouts.Speak.Sublayouts
{
  using System;
  using System.Web.UI.WebControls;
  using Sitecore.Data.Items;
  using Sitecore.Web;

  /// <summary>
  /// Defines the change password class.
  /// </summary>
  public partial class ChangePassword : System.Web.UI.UserControl
  {
    #region Constants and Fields

    /// <summary>
    /// The original user name
    /// </summary>
    private string originalUserName;

    /// <summary>
    /// Gets the data item.
    /// </summary>
    [NotNull]
    protected Item DataItem { get; private set; }

    #endregion

    #region Methods

    /// <summary>
    /// Called when the change password has error.
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.EventArgs"/> instance containing the event data.
    /// </param>
    protected void OnChangePasswordError(object sender, EventArgs e)
    {
      this.ChangePasswordControl.ChangePasswordTemplateContainer.FindControl("FailureText").Visible = true;
      this.ChangePasswordControl.UserName = this.originalUserName;
    }

    /// <summary>
    /// Called when the changed has password.
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.EventArgs"/> instance containing the event data.
    /// </param>
    protected void OnChangedPassword(object sender, EventArgs e)
    {
      this.ChangePasswordControl.UserName = this.originalUserName;
    }

    /// <summary>
    /// Called when the changing has password.
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.Web.UI.WebControls.LoginCancelEventArgs"/> instance containing the event data.
    /// </param>
    protected void OnChangingPassword(object sender, LoginCancelEventArgs e)
    {
      this.originalUserName = this.ChangePasswordControl.UserName;
      string userName = WebUtil.HandleFullUserName(this.ChangePasswordControl.UserName);
      this.ChangePasswordControl.UserName = userName;
    }

    /// <summary>
    /// Called when the server has validate.
    /// </summary>
    /// <param name="source">
    /// The source.
    /// </param>
    /// <param name="eventArgs">
    /// The event arguments.
    /// </param>
    protected void OnServerValidate(object source, ServerValidateEventArgs eventArgs)
    {
      eventArgs.IsValid = this.ChangePasswordControl.NewPassword == eventArgs.Value;
    }

    /// <summary>
    /// Called when the return to has default.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void OnReturnToDefault(object sender, EventArgs e)
    {
      this.ChangePasswordControl.ContinueDestinationPageUrl = Sitecore.Context.Site.VirtualFolder;
      this.ChangePasswordControl.CancelDestinationPageUrl = Sitecore.Context.Site.VirtualFolder;
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

      this.ChangePasswordControl.DataBind();
    }

    #endregion

    /// <summary>
    /// Handles the Validate event of the UserName control.
    /// </summary>
    /// <param name="source">The source of the event.</param>
    /// <param name="args">The arguments.</param>
    protected void UserNameValidate(object source, ServerValidateEventArgs args)
    {
      args.IsValid = Security.Accounts.User.Exists(WebUtil.HandleFullUserName(args.Value));
    }
  }
}