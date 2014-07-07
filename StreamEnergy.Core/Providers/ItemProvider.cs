using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Providers
{
    public class ItemProvider : Sitecore.Data.Managers.ItemProvider
    {
        protected override Item GetItem(ID itemId, Language language, Version version, Database database)
        {
            var item = base.GetItem(itemId, language, version, database);
            
            if (item == null || language.Name != "es" || database.Name == "core" || item.Versions.GetVersionNumbers().Length > 0)
            {
                return item;
            }
            
            // there is no version in this language.
            Language fallbackLanguage = Sitecore.Globalization.Language.Parse("en");
            
            Item fallback = GetItem(itemId, fallbackLanguage, Version.Latest, database);

            var stubData = new ItemData(fallback.InnerData.Definition, item.Language, item.Version, fallback.InnerData.Fields);
            var stub = new StubItem(itemId, stubData, database) { OriginalLanguage = item.Language };
            stub.RuntimeSettings.SaveAll = true;

            return stub;
        }
    }
}
