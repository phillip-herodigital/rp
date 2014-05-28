using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Extensions
{
    public static class SettingsExtensions
    {
        private static ISettings settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();

        /// <summary>
        /// Get a list of domains that should be translated for the given environment
        /// </summary>
        /// <param name="settings">The target settings object</param>
        /// <returns>A list of domains to be translated</returns>
        public static Dictionary<string, string> GetDomainTranslations(this ISettings settings)
        {
            var domainTranslations = settings.GetSettingsValue("Domain Translations", "Domain Translations");
            if (domainTranslations == null) return new Dictionary<string, string>();
            return (from line in domainTranslations.Split(new string[] { "\n" }, StringSplitOptions.RemoveEmptyEntries)
                    let parts = line.Split(new string[] { "=>" }, StringSplitOptions.RemoveEmptyEntries)
                    where parts.Length == 2
                    select new KeyValuePair<string, string>(parts[0], parts[1])).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
        }
    }
}
