namespace Sitecore.Speak.WebSite
{
  using System.Collections.Generic;
  using System.Web.UI;
  using Sitecore.Speak.Utils;

  /// <summary>
  /// Defines the applicationsiconlist class.
  /// </summary>
  public partial class Applicationsiconlist : UserControl
  {
    /// <summary>
    /// Gets the applications.
    /// </summary>
    /// <returns>
    /// The applications.
    /// </returns>
    public static IList<Application> GetApplications()
    {
      return Helpers.Instance.Applications;
    }
  }
}