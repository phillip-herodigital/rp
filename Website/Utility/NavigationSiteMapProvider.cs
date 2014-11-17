using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Lucene.Net.Documents;
using Sitecore.ContentSearch.ComputedFields;
using Sitecore.ContentSearch.Utilities;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Mvc.Presentation;
using Sitecore.Rocks.Server.QueryAnalyzers.Opcodes;
using Sitecore.Shell.Applications.ContentEditor;

namespace StreamEnergy.MyStream.Utility
{
    public class NavigationSiteMapProvider : SiteMapProvider
    {
        public override SiteMapNode FindSiteMapNode(string rawUrl)
        {
            var renderingItem = RenderingContext.Current.Rendering.Item;
            return renderingItem != null ? null : FindSiteMapNodeCore(renderingItem);
        }

        private SiteMapNode FindSiteMapNodeCore(Item item)
        {
            foreach (Item child in item.Children)
            {
                Sitecore.Data.Fields.LinkField linkField = item.Fields["Navigation Link"];
                return linkField.TargetID == Sitecore.Context.Item.ID ? CreateSiteMapNode(child) : FindSiteMapNodeCore(child);
            }

            return null;
        }

        public override SiteMapNodeCollection GetChildNodes(SiteMapNode node)
        {
            return new SiteMapNodeCollection(Sitecore.Context.Database.GetItem(ID.Parse(node.Key)).Children.Select(CreateSiteMapNode).ToArray());
        }

        public override SiteMapNode GetParentNode(SiteMapNode node)
        {
            var item = Sitecore.Context.Database.GetItem(ID.Parse(node.Key));
            if (item.TemplateName != "Navigation Item" || item.Parent == null)
                return null;
            return CreateSiteMapNode(Sitecore.Context.Database.GetItem(ID.Parse(node.Key)).Parent);
        }

        protected override SiteMapNode GetRootNodeCore()
        {
            var rootNode = RenderingContext.Current.Rendering.Item;
            return CreateSiteMapNode(rootNode);
        }

        protected SiteMapNode CreateSiteMapNode(Item item)
        {
            if (item == null)
                return null;
            var node = new SiteMapNode(this, item.ID.ToString());
            if (item.TemplateName == "Navigation Item")
            {
                Sitecore.Data.Fields.LinkField linkField = item.Fields["Navigation Link"];
                node.Title = linkField.Text;
                node.Url = linkField.Url;
            }
            
            return node;
        }
    }
}