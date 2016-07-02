using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.Extensions
{
    public static class HtmlStringExtensions
    {
        public static IHtmlString Format(this IHtmlString pattern, object template)
        {
            if (!Sitecore.Context.PageMode.IsPageEditor)
                return new HtmlString(pattern.ToString().Format(template));
            return pattern;
        }
    }
}
