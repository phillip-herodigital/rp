using Sitecore.ContentSearch;
using Sitecore.ContentSearch.Linq.Utilities;
using Sitecore.ContentSearch.SearchTypes;
using Sitecore.ContentSearch.Security;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.Globalization;
using Sitecore.Links;
using Sitecore.Resources.Media;
using StreamEnergy.MyStream.Models.Currents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Http;
using XBlogHelper;
using XBlogHelper.General;
using XBlogHelper.Helpers;
using XBlogHelper.Models.Blog;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class CurrentsSearchResultItem : SearchResultItem
    {
        [IndexField("publish_date")]
        public string PublishDate { get; set; }
    }
    
    [RoutePrefix("api/currents")]
    public class CurrentsController : ApiController
    {
        public static IEnumerable<BlogPost> GetCurrentsPosts(Item currentItem, string categoryID, string authorID, string tagID, string searchText, int startRowIndex, int maximumRows, string language)
		{
			try
			{
				Item repositorySearchItem = XBlogHelper.General.DataManager.GetBlogHomeItem(currentItem);
				ISearchIndex index = ContentSearchManager.GetIndex(new SitecoreIndexableItem(repositorySearchItem));
				using (IProviderSearchContext providerSearchContext = index.CreateSearchContext(SearchSecurityOptions.EnableSecurityCheck))
				{
                    Expression<Func<CurrentsSearchResultItem, bool>> expression = PredicateBuilder.True<CurrentsSearchResultItem>();
                    expression = expression.And((CurrentsSearchResultItem item) => item.TemplateName == "Blog Post" && item.Language == language && item.Paths.Contains(repositorySearchItem.ID));
					if (!string.IsNullOrEmpty(categoryID))
					{
                        expression = expression.And((CurrentsSearchResultItem c) => c["Category"].Contains(categoryID));
					}
					if (!string.IsNullOrEmpty(authorID))
					{
                        expression = expression.And((CurrentsSearchResultItem a) => a["Author"].Contains(authorID));
					}
					if (!string.IsNullOrEmpty(tagID))
					{
                        expression = expression.And((CurrentsSearchResultItem t) => t["Tags"].Contains(tagID));
					}
					if (!string.IsNullOrEmpty(searchText))
					{
                        expression = expression.And((CurrentsSearchResultItem t) => t["_content"].Contains(searchText));
					}
                    if (currentItem.TemplateName == "Blog Post") 
                    {
                        expression = expression.And((CurrentsSearchResultItem item) => Convert.ToDateTime(item.PublishDate) < Convert.ToDateTime(currentItem.Fields["Publish Date"].Value));
                    }
					return (
                        from t in providerSearchContext.GetQueryable<CurrentsSearchResultItem>().Where(expression)
						orderby t[XBSettings.XBSearchPublishDate] descending
						select t).Slice(startRowIndex, maximumRows).CreateAs<BlogPost>().ToList<BlogPost>();
				}
			}
			catch (Exception exception)
			{
                Log.Error("Currents GetCurrentsPosts error", exception, new object());
			}
			return null;
		}

        public static int GetCurrentsCount(Item currentItem, string categoryID, string authorID, string tagID, string searchText, string language)
        {
            try
            {
                Item repositorySearchItem = XBlogHelper.General.DataManager.GetBlogHomeItem(currentItem);
                ISearchIndex index = ContentSearchManager.GetIndex(new SitecoreIndexableItem(repositorySearchItem));
                using (IProviderSearchContext providerSearchContext = index.CreateSearchContext(SearchSecurityOptions.EnableSecurityCheck))
                {
                    Expression<Func<SearchResultItem, bool>> expression = PredicateBuilder.True<SearchResultItem>();
                    expression = expression.And((SearchResultItem item) => item.TemplateName == "Blog Post" && item.Language == language && item.Paths.Contains(repositorySearchItem.ID));
                    if (!string.IsNullOrEmpty(categoryID))
                    {
                        expression = expression.And((SearchResultItem c) => c["Category"].Contains(categoryID));
                    }
                    if (!string.IsNullOrEmpty(authorID))
                    {
                        expression = expression.And((SearchResultItem a) => a["Author"].Contains(authorID));
                    }
                    if (!string.IsNullOrEmpty(tagID))
                    {
                        expression = expression.And((SearchResultItem t) => t["Tags"].Contains(tagID));
                    }
                    if (!string.IsNullOrEmpty(searchText))
                    {
                        expression = expression.And((SearchResultItem t) => t["_content"].Contains(searchText));
                    }
                    return (
                        from t in providerSearchContext.GetQueryable<SearchResultItem>().Where(expression)
                        orderby t[XBSettings.XBSearchPublishDate] descending
                        select t).CreateAs<BlogPost>().Count<BlogPost>();
                }
            }
            catch (Exception exception)
            {
                Log.Error("Currents GetCount error", exception, new object());
            }
            return 0;
        }

        [HttpPost]
        public dynamic LoadPosts (LoadPostsRequest request)
        {
            string currentBlock = "";

            Item blogRoot = Sitecore.Context.Database.GetItem("{9EF9914F-714A-4515-BC67-5548D2BBDEB0}");
            BlogSettings settingsItem = XBlogHelper.General.DataManager.GetBlogSettingsItem(blogRoot);
            Item currentItem = Sitecore.Context.Database.GetItem(request.currentItemId);
            IEnumerable<BlogPost> blogs = GetCurrentsPosts(currentItem, request.categoryID, request.authorID, request.tagID, request.searchText, request.startRowIndex, request.maximumRows, request.language);

            foreach (var blogPost in blogs.Select((blog, i) => new { blog, i }))
            {
            
                ImageField imageField = null;
                var gridClasses = "<div class=\"grid-item " + blogPost.blog.Categories.FirstOrDefault().Name.ToLower();
                if (blogPost.i == 0 || blogPost.i == 8) 
                {
                    gridClasses += " grid-item--width4";
                    imageField = (ImageField)blogPost.blog.InnerItem.Fields["Large Rectangle"]; 
                }
                else if (blogPost.i == 3 || blogPost.i == 9) 
                {
                    gridClasses += " grid-item--width2 grid-item--height2";
                    imageField = (ImageField)blogPost.blog.InnerItem.Fields["Square"]; 
                }
                else if (blogPost.i == 6 || blogPost.i == 15) 
                {
                    gridClasses += " grid-item--width3";
                    imageField = (ImageField)blogPost.blog.InnerItem.Fields["Small Rectangle"]; 
                }
                else
                {
                    imageField = (ImageField)blogPost.blog.InnerItem.Fields["Square"];
                }

                if (imageField.MediaItem == null)
                {
                    gridClasses += " no-image";
                    currentBlock += gridClasses + "\">";
                }
                else
                {
                    currentBlock += gridClasses + "\" style=\"background-image: url(\\\'" + MediaManager.GetMediaUrl(imageField.MediaItem) + "\\\') \">";
                }

                if (!string.IsNullOrEmpty(blogPost.blog.InnerItem.Fields["YouTube ID"].Value))
                {
                    currentBlock += "<div class=\"article-video\"></div>";
                }
               currentBlock += "<div class=\"article-overview\">" +
                    "<span class=\"article-date\">" + (blogPost.blog.PublishDate.DateTime.ToString(settingsItem.BlogListingDateFormat)) + "</span>" +
                    "<h2><a href=\"" + HttpUtility.HtmlEncode(LinkManager.GetItemUrl(blogPost.blog.InnerItem)) + "\">" + blogPost.blog.Title + "</a></h2>" +
                    "<div class=\"article-summary\">";
                if (!String.IsNullOrEmpty(blogPost.blog.Summary))
                {
                    currentBlock += HttpUtility.HtmlEncode(blogPost.blog.Summary);
                }
                currentBlock += "</div></div></div>";
            }

            return new { html = currentBlock };
        }

    }
}