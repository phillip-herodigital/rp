using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using Sitecore;
using Sitecore.Configuration;
using Sitecore.Data;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Links;
using Sitecore.Mvc.Presentation;
using Sitecore.Xml.Xsl;

namespace StreamEnergy.MyStream.Utility
{
    public class NavigationSiteMapProvider : SiteMapProvider
    {
        public override SiteMapNode CurrentNode
        {
            get { return FindSiteMapNode(Context.Item); }
        }

        public override SiteMapNode FindSiteMapNode(string rawUrl)
        {
            throw new NotImplementedException();
        }

        public virtual SiteMapNode FindSiteMapNode(Item item)
        {
            var renderingItem = RenderingContext.Current.Rendering.Item;
            if (renderingItem == null)
                return null;

            return (from navigationItem in renderingItem.GetDescendantsAndSelf()
                    let linkField = navigationItem.Fields["Navigation Link"]
                    where (LinkField)linkField != null && ((LinkField)linkField).TargetID == item.ID
                    select new ItemSiteMapNode(this, navigationItem)).FirstOrDefault();
        }

        public override SiteMapNodeCollection GetChildNodes(SiteMapNode node)
        {
            return new SiteMapNodeCollection(Context.Database.GetItem(ID.Parse(node.Key)).Children.Select(i => (SiteMapNode)new ItemSiteMapNode(this, i)).ToArray());
        }

        public override SiteMapNode GetParentNode(SiteMapNode node)
        {
            var item = Context.Database.GetItem(ID.Parse(node.Key));
            if (item.TemplateName != "Navigation Item" || item.Parent == null)
                return null;
            return new ItemSiteMapNode(this, Context.Database.GetItem(ID.Parse(node.Key)).Parent);
        }

        protected override SiteMapNode GetRootNodeCore()
        {
            var rootNode = RenderingContext.Current.Rendering.Item;
            return new ItemSiteMapNode(this, rootNode);
        }
    }

    public sealed class ItemSiteMapNode : SiteMapNode
    {
        public ItemSiteMapNode(SiteMapProvider provider, Item item)
            : base(provider, item.ID.ToString())
        {
            Item = item;
            LinkField linkField = item.Fields["Navigation Link"];
            if (linkField != null)
            {
                Description = linkField.Title;
                Attributes = new NameValueCollection
                {
                    {"Class", linkField.Class},
                    {"Target", linkField.Target}
                };
            }

            Title = linkField == null ? string.Empty : linkField.Text;
            if (string.IsNullOrEmpty(Title) && linkField != null && linkField.TargetItem != null)
                Title = linkField.TargetItem.DisplayName ?? string.Empty;
              
            Url = GetUrl(linkField) ?? string.Empty;
            if (linkField != null && linkField.LinkType == "javascript")
                Url = "javascript:" + HttpUtility.UrlEncode(Url).Replace("+", "%20");
        }

        public Item Item { get; set; }

        private string GetUrl(XmlField field)
        {
            var defaultUrlOptions = LinkManager.GetDefaultUrlOptions();
            defaultUrlOptions.SiteResolving = Settings.Rendering.SiteResolving;
            return field != null ? new LinkUrl().GetUrl(field, Item.Database) : LinkManager.GetItemUrl(Item, defaultUrlOptions);
        }
    }

    public static class SiteMapNodeExtensions
    {
        public static int Level(this SiteMapNode node)
        {
            var level = 0;
            while (node.ParentNode != null)
            {
                level++;
                node = node.ParentNode;
            }

            return level;
        }

        public static IEnumerable<SiteMapNode> GetAncestors(this SiteMapNode node)
        {
            while (node.ParentNode != null)
            {
                node = node.ParentNode;
                yield return node;
            }
        }

        public static SiteMapNode GetAncestor(this SiteMapNode node, int level)
        {
            return GetAncestors(node).Skip(level).FirstOrDefault();
        }
    }
}