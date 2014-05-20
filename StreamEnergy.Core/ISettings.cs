using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sitecore.Data.Items;

namespace StreamEnergy
{
    public interface ISettings
    {
        /// <summary>
        /// Gets the appropriate sitecore item given the relative path. If the current environment name exists as a 
        /// sub-item from the discovered item, it will be returned instead.
        /// </summary>
        /// <param name="relativePath">The path relative to the /sitecore/content/Data/Settings node</param>
        /// <returns>A Sitecore Item, or null if the settings were not found</returns>
        Item GetSettingsItem(string relativePath);

        /// <summary>
        /// Gets the value of a field for the settings item specified. If an environment-specific item is used and the
        /// field does not exist on that item, the parent item will be checked.
        /// </summary>
        /// <param name="relativePath">The path relative to the /sitecore/content/Data/Settings node</param>
        /// <param name="fieldName">The field from which to get the value</param>
        /// <returns>The value of the field, or null if the field was not found.</returns>
        string GetSettingsValue(string relativePath, string fieldName);
    }
}
