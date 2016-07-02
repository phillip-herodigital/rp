using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sitecore.Diagnostics;
using Sitecore.Pipelines.RenderField;
using StreamEnergy.Extensions;

namespace StreamEnergy.Pipelines.RenderField
{
    public class GetTextFieldValueExtended
    {
        private static ISettings settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
        public void Process(RenderFieldArgs args)
        {
            if (!Sitecore.Context.PageMode.IsPageEditor && args.Result != null && !string.IsNullOrEmpty(args.Result.FirstPart))
            {
                foreach (var domain in settings.GetDomainTranslations())
                {
                    args.Result.FirstPart = args.Result.FirstPart.Replace(domain.Key, domain.Value);
                }
            }
        }
    }
}
