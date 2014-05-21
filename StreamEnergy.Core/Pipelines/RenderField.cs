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
                    {"https://secure.streamenergy.net", "http://uat.secure.streamenergy.net"},
                    {"https://secure3.i-doxs.net", "https://preprod.i-doxs.net"},
                };
                foreach (var item in dict)
                {
                    args.Result.FirstPart = args.Result.FirstPart.Replace(item.Key, item.Value);
                }
            }
        }
    }
}
