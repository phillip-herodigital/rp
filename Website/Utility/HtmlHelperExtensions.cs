using System.Text;
using System.Web;
using System.Web.Mvc;
using HtmlAgilityPack;

namespace StreamEnergy.MyStream.Utility
{
    public static class HtmlHelperExtensions
    {
        public static IHtmlString Truncate(this HtmlHelper htmlHelper, string html, int length)
        {
            var document = new HtmlDocument();
            document.LoadHtml(html);

            var sb = new StringBuilder();
            foreach (var node in document.DocumentNode.DescendantsAndSelf())
            {
                if (sb.Length > length)
                    break;
                switch (node.NodeType)
                {
                    case HtmlNodeType.Text:
                        sb.Append(node.OuterHtml);
                        break;
                    case HtmlNodeType.Element:
                        switch (node.Name)
                        {
                            case "img":
                                sb.Append(node.GetAttributeValue("alt", string.Empty));
                                break;
                        }
                        break;
                }
            }

            return sb.Length > length ? htmlHelper.Raw(sb.ToString().Substring(0, length - 1) + "…") : htmlHelper.Raw(sb.ToString());
        }
    }
}