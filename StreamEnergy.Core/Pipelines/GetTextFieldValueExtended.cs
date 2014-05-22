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
        private static ISettings settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
        public void Process(RenderFieldArgs args)
        {
            if (!Sitecore.Context.PageMode.IsPageEditor && args.Result != null && !string.IsNullOrEmpty(args.Result.FirstPart))
            {
                var domains = from line in settings.GetSettingsValue("Domain Translations", "Domain Translations").Split(new string[] { "\n" }, StringSplitOptions.RemoveEmptyEntries)
                              let parts = line.Split(new string[] { "=>" }, StringSplitOptions.RemoveEmptyEntries)
                              where parts.Length == 2
                              select new KeyValuePair<string, string>(parts[0], parts[1]);

                foreach (var domain in domains)
                {
                    args.Result.FirstPart = args.Result.FirstPart.Replace(domain.Key, domain.Value);
                }
            }
        }
    }
}
