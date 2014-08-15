using System;

namespace Sitecore.Speak.WebSite.layouts.Speak.Sublayouts
{
  using System.Web;
  using System.Web.UI;

  using Sitecore.Web.UI.WebControls;

  public partial class IconListPage : System.Web.UI.UserControl
  {   

    protected void OpenDialog_Click(object sender, EventArgs args)
    {
      var dialogUrl = "/Default.aspx";

      ScriptManager.GetCurrent(this.Page).ShowPopup(HttpUtility.UrlPathEncode(dialogUrl));    
    }

  }
}