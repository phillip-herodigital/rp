using Sitecore;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Globalization;

namespace StreamEnergy.Providers
{
    public class StubItem : Item
    {
        public StubItem([NotNull] ID itemID, [NotNull] ItemData data, [NotNull] Database database)
            : base(itemID, data, database)
        {
        }

        private Language originalLanguage;

        public Language OriginalLanguage
        {
            get
            {
                return originalLanguage ?? Language;
            }
            set
            {
                originalLanguage = value;
            }
        }
    }
}
