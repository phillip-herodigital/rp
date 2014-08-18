// --------------------------------------------------------------------------------------------------------------------
// <copyright file="top.ascx.cs" company="Sitecore A/S">
//   Copyright (c) Sitecore A/S. All rights reserved.
// </copyright>
// <summary>
//   Defines the Login class.
// </summary>
// --------------------------------------------------------------------------------------------------------------------
namespace Sitecore.Speak.WebSite
{
    using System;
    using System.Web.UI;

    /// <summary>
    /// Defines the top class.
    /// </summary>
    public partial class top : UserControl
    {
        /// <summary>
        /// Raises the <see cref="E:System.Web.UI.Control.Init"/> event.
        /// </summary>
        /// <param name="e">An <see cref="T:System.EventArgs"/> object that contains the event data.</param>
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            this.heading1.InnerText = string.IsNullOrEmpty(Sitecore.Context.Item["Title"]) ? string.Empty : Sitecore.Context.Item["Title"];
        }
    }
}