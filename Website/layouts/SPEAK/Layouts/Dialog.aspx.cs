// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Dialog.aspx.cs" company="Sitecore A/S">
//   Copyright (C) 2010 by Sitecore A/S
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Sitecore.Speak.WebSite
{
  using System;
  using System.Web;
  using System.Web.UI.HtmlControls;
  using Sitecore;
  using Sitecore.Speak.Extensions;
  using Sitecore.Web.UI.WebControls;

  /// <summary>
  /// Defines the dialog class.
  /// </summary>
  public partial class Dialog : PopupPage
  {
    #region Constants and Fields

    /// <summary>
    /// </summary>
    protected HtmlGenericControl Popup;

    #endregion

    #region Public Methods

    #endregion

    #region Methods

    /// <summary>
    /// Called when the cancel has click.
    /// </summary>
    /// <param name="sender">
    /// The sender.
    /// </param>
    /// <param name="e">
    /// The <see cref="System.EventArgs"/> instance containing the event data.
    /// </param>
    protected void OnCancelClick(object sender, EventArgs e)
    {
      this.Close();
    }

    /// <summary>
    /// </summary>
    /// <param name="sender">
    /// </param>
    /// <param name="e">
    /// </param>
    protected virtual void OnClose([CanBeNull] object sender, [CanBeNull] EventArgs e)
    {
      this.Close();
    }

    /// <summary>
    /// </summary>
    /// <param name="e">
    /// </param>
    protected override void OnInit(EventArgs e)
    {
      base.OnInit(e);
      this.CloseButton.Click += this.OnClose;

    }

    


    #endregion
  }
}