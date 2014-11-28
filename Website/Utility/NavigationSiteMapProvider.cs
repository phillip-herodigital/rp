using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.ContentSearch.Utilities;
using Sitecore.Data;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Mvc.Presentation;
using Sitecore.Shell.Framework.Commands;

namespace StreamEnergy.MyStream.Utility
{
    public class NavigationSiteMapProvider : SiteMapProvider
    {
        public override SiteMapNode FindSiteMapNode(string rawUrl)
        {
            return FindSiteMapNode(Sitecore.Context.Item);
        }

        public SiteMapNode FindSiteMapNode(Item item)
        {
            var renderingItem = RenderingContext.Current.Rendering.Item;
            if (renderingItem == null)
                return null;

            return (from navigationItem in renderingItem.GetDescendantsAndSelf()
                let linkField = navigationItem.Fields["Navigation Link"]
                where (LinkField) linkField != null && ((LinkField) linkField).TargetID == item.ID
                select new ItemSiteMapNode(this, navigationItem)).FirstOrDefault();
        }

        public override SiteMapNodeCollection GetChildNodes(SiteMapNode node)
        {
            return new SiteMapNodeCollection(Sitecore.Context.Database.GetItem(ID.Parse(node.Key)).Children.Select(i => (SiteMapNode)new ItemSiteMapNode(this, i)).ToArray());
        }

        public override SiteMapNode GetParentNode(SiteMapNode node)
        {
            var item = Sitecore.Context.Database.GetItem(ID.Parse(node.Key));
            if (item.TemplateName != "Navigation Item" || item.Parent == null)
                return null;
            return new ItemSiteMapNode(this, Sitecore.Context.Database.GetItem(ID.Parse(node.Key)).Parent);
        }

        protected override SiteMapNode GetRootNodeCore()
        {
            var rootNode = RenderingContext.Current.Rendering.Item;
            return new ItemSiteMapNode(this, rootNode);
        }
    }

    public class ItemSiteMapNode : SiteMapNode
    {
        public ItemSiteMapNode(SiteMapProvider provider, Item item)
            : base(provider, item.ID.ToString())
        {
            Item = item;
            if (item.TemplateName != "Navigation Item")
                return;

            LinkField linkField = item.Fields["Navigation Link"];
            if (linkField == null) return;

            Title = linkField.Text;
        }

        public Item Item { get; set; }
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