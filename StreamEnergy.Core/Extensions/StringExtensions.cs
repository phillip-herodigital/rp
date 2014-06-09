using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.Extensions
{
    public static class StringExtensions
    {
        static readonly Regex rePattern = new Regex(@"(\{+)([^\}]+)(\}+)", RegexOptions.Compiled);

        /// <summary>
        /// Prepends a prefix if the target is not null or empty
        /// </summary>
        /// <param name="target">The target string in question</param>
        /// <param name="prefix">The prefix</param>
        /// <returns>The prefix and target, or the original target if it was null or empty</returns>
        public static string Prefix(this string target, string prefix)
        {
            if (!string.IsNullOrEmpty(target))
                return prefix + target;
            return target;
        }

        public static IHtmlString AsHtml(this string target)
        {
            return new HtmlString(target);
        }

        public static string Format(this string pattern, object template)
        {
            if (template == null) throw new ArgumentNullException();
            Type type = template.GetType();
            var cache = new Dictionary<string, string>();
            return rePattern.Replace(pattern, match =>
            {
                int lCount = match.Groups[1].Value.Length,
                    rCount = match.Groups[3].Value.Length;
                if ((lCount % 2) != (rCount % 2)) throw new InvalidOperationException("Unbalanced braces");
                string lBrace = lCount == 1 ? "" : new string('{', lCount / 2),
                    rBrace = rCount == 1 ? "" : new string('}', rCount / 2);

                string key = match.Groups[2].Value, value;
                if (lCount % 2 == 0)
                {
                    value = key;
                }
                else
                {
                    if (!cache.TryGetValue(key, out value))
                    {
                        var prop = type.GetProperty(key);
                        if (prop == null)
                        {
                            return match.Groups[0].Value;
                        }
                        value = Convert.ToString(prop.GetValue(template, null));
                        cache.Add(key, value);
                    }
                }
                return lBrace + value + rBrace;
            });
        }

        public static string RenderFieldFrom(this string fieldName, Sitecore.Data.Items.Item item, bool fallbackToFieldName = false)
        {
            string text = null;
            if (item != null && item[fieldName] != null)
            {
                try
                {
                    text = Sitecore.Web.UI.WebControls.FieldRenderer.Render(item, fieldName);
                }
                catch
                {
                    text = item[fieldName];
                }
            }

            return (string.IsNullOrEmpty(text) && fallbackToFieldName) ? fieldName : text;
        }
    }
}
