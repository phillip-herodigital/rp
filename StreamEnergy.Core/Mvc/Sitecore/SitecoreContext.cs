using Sitecore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Mvc.Sitecore
{
    using Sitecore = global::Sitecore;

    class SitecoreContext : StreamEnergy.Mvc.Sitecore.ISitecoreContext
    {
        public Sitecore.Data.Database Database
        {
            get { return Context.Database; }
        }

        public Sitecore.Globalization.Language ContentLanguage
        {
            get { return Context.ContentLanguage; }
        }

        public System.Globalization.CultureInfo Culture
        {
            get { return Context.Culture; }
        }

        public Sitecore.Data.Items.Item Item
        {
            get { return Context.Item; }
        }
    }
}
