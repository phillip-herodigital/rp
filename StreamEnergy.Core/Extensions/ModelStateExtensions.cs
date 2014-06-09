using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace StreamEnergy.Extensions
{
    public static class ModelStateExtensions
    {
        public static void Translate(this ModelStateDictionary modelState, Sitecore.Data.Items.Item item = null)
        {
            item = item ?? Sitecore.Context.Item;
            if (item == null)
                return;
            foreach (var value in modelState.Values)
            {
                var errs = value.Errors.ToArray();
                value.Errors.Clear();
                foreach (var error in errs)
                {
                    var translated = item[error.ErrorMessage];
                    if (!string.IsNullOrEmpty(translated))
                    {
                        value.Errors.Add(translated);
                    }
                }
            }
        }
    }
}
