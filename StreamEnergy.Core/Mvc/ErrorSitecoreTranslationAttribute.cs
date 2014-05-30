using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Sitecore;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;

namespace StreamEnergy.Mvc
{
    public class ErrorSitecoreTranslationAttribute : ActionFilterAttribute
    {
        public string SitecoreItemId { get; set; }

        public Item Item
        {
            get
            {
                if (string.IsNullOrEmpty(SitecoreItemId))
                {
                    return Context.Item;
                }
                else
                {
                    return Context.Database.GetItem(new ID(SitecoreItemId));
                }
            }
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (filterContext.Controller is Controller)
            {
                foreach (var modelEntry in ((Controller)filterContext.Controller).ModelState)
                {
                    var item = Item;
                    if (item != null)
                    {
                        var errors = modelEntry.Value.Errors.ToArray();
                        foreach (var entry in errors)
                        {
                            if (!string.IsNullOrEmpty(entry.ErrorMessage))
                            {
                                if (entry.Exception != null)
                                    modelEntry.Value.Errors.Add(new ModelError(entry.Exception, FieldRenderer.Render(item, entry.ErrorMessage)));
                                else
                                    modelEntry.Value.Errors.Add(FieldRenderer.Render(item, entry.ErrorMessage));
                            }
                        }
                    }
                }
            }

            base.OnActionExecuted(filterContext);
        }
    }
}
