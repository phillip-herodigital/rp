using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RestSharp.Extensions;
using Sitecore;
using Sitecore.Configuration;
using Sitecore.ContentSearch.Utilities;
using Sitecore.Data;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Data.Managers;
using Sitecore.Diagnostics;
using Sitecore.Globalization;
using Sitecore.IO;
using Sitecore.Links;
using Sitecore.Mvc.Presentation;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.SecurityModel;
using Sitecore.Shell.Applications.ContentEditor;
using Sitecore.Shell.Framework.Commands;
using Sitecore.Sites;
using Sitecore.Web;
using Sitecore.Xml.Xsl;
using Version = Sitecore.Data.Version;

namespace StreamEnergy.MyStream.Utility
{
    public class NavigationSiteMapProvider : SiteMapProvider
    {
        public override SiteMapNode FindSiteMapNode(string rawUrl)
        {
            return FindSiteMapNode(Context.Item);

            /* var args = new HttpRequestArgs(HttpContext.Current, HttpRequestType.PostRequestHandlerExecuted);

            var url = RequestUrl.Parse(HttpContext.Current.Request);
            url.QueryString = HtmlSpecialChars(url.QueryString);

            var path = MainUtil.DecodeName(url.ItemPath);
            var obj = args.GetItem(path);
            if (obj == null)
            {
                path = url.ItemPath;
                obj = args.GetItem(path);
            }
            if (obj == null)
            {
                path = args.LocalPath;
                obj = args.GetItem(path);
            }
            if (obj == null)
            {
                path = MainUtil.DecodeName(args.LocalPath);
                obj = args.GetItem(path);
            }
            var site = Context.Site;
            var part1 = site != null ? site.RootPath : string.Empty;
            if (obj == null)
            {
                path = FileUtil.MakePath(part1, args.LocalPath, '/');
                obj = args.GetItem(path);
            }
            if (obj == null)
            {
                path = MainUtil.DecodeName(FileUtil.MakePath(part1, args.LocalPath, '/'));
                obj = args.GetItem(path);
            }
            if (obj == null)
                obj = ResolveUsingDisplayName(args);
            if (obj == null && args.UseSiteStartPath && site != null)
                obj = args.GetItem(site.StartPath);

            return obj == null ? null : FindSiteMapNode(obj); */
        }

        private static string HtmlSpecialChars(string html)
        {
            return html.Replace("(", "&#40;").Replace(")", "&#41;").Replace("<", "&lt;").Replace(">", "&gt;");
        }

        private static Item GetChild(Item item, string itemName)
        {
            foreach (Item obj in item.Children)
            {
                if (obj.DisplayName.Equals(itemName, StringComparison.OrdinalIgnoreCase) || obj.Name.Equals(itemName, StringComparison.OrdinalIgnoreCase))
                    return obj;
            }
            return null;
        }

        /// <summary>
        /// Gets a sub item.
        /// 
        /// </summary>
        /// <param name="path">The path.</param><param name="root">The root.</param>
        /// <returns/>
        private static Item GetSubItem(string path, Item root)
        {
            var obj = root;
            var str = path;
            var chArray = new[] { '/' };
            foreach (var itemName in str.Split(chArray).Where(itemName => itemName.Length != 0))
            {
                obj = GetChild(obj, itemName);
                if (obj == null)
                    return null;
            }
            return obj;
        }

        /// <summary>
        /// Resolves the full path.
        /// 
        /// </summary>
        /// <param name="args">The args.</param>
        /// <returns/>
        private static Item ResolveFullPath(HttpRequestArgs args)
        {
            var itemPath = args.Url.ItemPath;
            if (string.IsNullOrEmpty(itemPath) || itemPath[0] != 47)
                return null;
            var num = itemPath.IndexOf('/', 1);
            if (num < 0)
                return null;
            var root = ItemManager.GetItem(itemPath.Substring(0, num), Language.Current, Version.Latest, Context.Database, SecurityCheck.Disable);
            return root == null ? null : GetSubItem(MainUtil.DecodeName(itemPath.Substring(num)), root);
        }

        /// <summary>
        /// Resolves the local path.
        /// 
        /// </summary>
        /// <param name="args">The args.</param>
        /// <returns/>
        private static Item ResolveLocalPath(HttpRequestArgs args)
        {
            var site = Context.Site;
            if (site == null)
                return null;
            var root = ItemManager.GetItem(site.RootPath, Language.Current, Version.Latest, Context.Database, SecurityCheck.Disable);
            return root == null ? null : GetSubItem(MainUtil.DecodeName(args.LocalPath), root);
        }

        /// <summary>
        /// Resolves the display name of the using.
        /// 
        /// </summary>
        /// <param name="args">The args.</param>
        /// <returns/>
        private Item ResolveUsingDisplayName(HttpRequestArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            Item obj;
            using (new SecurityDisabler())
            {
                obj = ResolveLocalPath(args) ?? ResolveFullPath(args);
                if (obj == null)
                    return null;
            }
            return args.ApplySecurity(obj);
        }

        public SiteMapNode FindSiteMapNode(Item item)
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