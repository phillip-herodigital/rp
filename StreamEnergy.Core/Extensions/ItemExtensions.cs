using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Extensions
{
    public static class ItemExtensions
    {

        public static bool? IsChecked(this Item sitecoreItem, string fieldName)
        {
            var field = (CheckboxField)sitecoreItem.Fields[fieldName];
            if (field == null)
                return null;
            return field.Checked;
        }

        public static string SafeFieldValue(this Item target, string fieldName)
        {
            if (target == null)
                return null;

            return target[fieldName];
        }
    }
}
