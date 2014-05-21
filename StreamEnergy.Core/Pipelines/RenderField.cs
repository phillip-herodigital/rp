using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sitecore.Diagnostics;
using Sitecore.Pipelines.RenderField;

namespace StreamEnergy.Pipelines.RenderField
{
    public class GetTextFieldValueExtended
    {
        public void Process(RenderFieldArgs args)
        {
            if (!Sitecore.Context.PageMode.IsPageEditor && args.Result != null && !string.IsNullOrEmpty(args.Result.FirstPart))
            {
                var dict = new Dictionary<string, string>()
                {
                    {"secure.streamenergy.net", "uat.secure.streamenergy.net"},
                    {"secure3.i-doxs.net", "preprod.i-doxs.net"},
                };
                foreach (var item in dict)
                {
                    args.Result.FirstPart.Replace(item.Key, item.Value);
                }
            }
        }
    }
}
