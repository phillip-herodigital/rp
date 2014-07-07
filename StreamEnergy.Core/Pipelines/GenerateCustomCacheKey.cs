using Sitecore.Data.Fields;
using Sitecore.Mvc.Pipelines.Response.RenderRendering;
using Sitecore.Mvc.Presentation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Pipelines
{
    public class GenerateCustomCacheKey : GenerateCacheKey
    {
        protected override string GenerateKey(Rendering rendering, RenderRenderingArgs args)
        {
            var cacheKey = base.GenerateKey(rendering, args);
            cacheKey = string.Concat(cacheKey, GetCustomCacheKeyPart(rendering, args));
            return cacheKey;
        }
        private string GetCustomCacheKeyPart(Rendering rendering, RenderRenderingArgs args)
        {
            if (rendering.RenderingItem.InnerItem.Fields["VaryByUrl"] != null && ((CheckboxField)rendering.RenderingItem.InnerItem.Fields["VaryByUrl"]).Checked)
            {
                return Sitecore.Context.Item.ID.ToString();
            }
            return null;
        }
    }
}
