using System;
namespace StreamEnergy.Mvc.Sitecore
{
    using Sitecore = global::Sitecore;

    public interface ISitecoreContext
    {
        Sitecore.Globalization.Language ContentLanguage { get; }
        System.Globalization.CultureInfo Culture { get; }
        Sitecore.Data.Database Database { get; }
        Sitecore.Data.Items.Item Item { get; }
    }
}
