using DDay.iCal;
using DDay.iCal.Serialization;
using Sitecore;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.Converters;
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
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using XBlogHelper;
using XBlogHelper.General;
using XBlogHelper.Helpers;
using XBlogHelper.Models.Blog;
using System.Web.Script.Serialization;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class CurrentsSearchResultItem : SearchResultItem
    {
        [TypeConverter(typeof(IndexFieldDateTimeValueConverter))]
        [IndexField("publish_date")]
        public DateTime PublishDate { get; set; }
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
                        DateTime publishDate = Sitecore.DateUtil.IsoDateToDateTime(currentItem.Fields["Publish Date"].Value);
                        expression = expression.And((CurrentsSearchResultItem item) => item.PublishDate < publishDate);
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
                        DateTime publishDate = Sitecore.DateUtil.IsoDateToDateTime(currentItem.Fields["Publish Date"].Value);
                        expression = expression.And((CurrentsSearchResultItem item) => item.PublishDate < publishDate);
                    }
                    return (
                        from t in providerSearchContext.GetQueryable<CurrentsSearchResultItem>().Where(expression)
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
                string articleText = "";
                string category = blogPost.blog.Categories.Any() ? blogPost.blog.Categories.FirstOrDefault().Name.ToLower() : "";
                var gridClasses = "<a href=\"" + HttpUtility.HtmlEncode(LinkManager.GetItemUrl(blogPost.blog.InnerItem)) + "\"><div class=\"grid-item medium-large " + category;
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
                    gridClasses += " no-image\">";
                }
                else
                {
                    gridClasses += "\" style=\"background-image: url(\\\'" + MediaManager.GetMediaUrl(imageField.MediaItem) + "\\\') \">";
                }

                if (!string.IsNullOrEmpty(blogPost.blog.InnerItem.Fields["YouTube ID"].Value))
                {
                    articleText += "<div class=\"article-video\"></div>";
                }
                articleText += "<div class=\"article-overview\">" +
                    "<span class=\"article-date\">" + (blogPost.blog.PublishDate.DateTime.ToString(settingsItem.BlogListingDateFormat)) + "</span>" +
                    "<h2>" + blogPost.blog.Title + "</h2>" +
                    "<div class=\"article-summary\" ellipsis>";
                if (!String.IsNullOrEmpty(blogPost.blog.Summary))
                {
                    articleText += blogPost.blog.Summary;
                }
                articleText += "</div></div>";
                currentBlock += gridClasses + articleText + "</div>";
                // create the block for mobile styles
                imageField = (ImageField)blogPost.blog.InnerItem.Fields["Square"];
                gridClasses = "<div class=\"grid-item small " + category;
                if (imageField.MediaItem == null)
                {
                    gridClasses += " no-image";
                }
                else
                {
                    gridClasses += "\" style=\"background-image: url(\\\'" + MediaManager.GetMediaUrl(imageField.MediaItem) + "\\\')";
                }
                currentBlock += gridClasses + "\">" + articleText + "</div></a>";
            }

            return new { html = currentBlock };
        }

        [HttpGet]
        public dynamic CalendarEvents()
        {
            Dictionary<string, List<dynamic>> events = new Dictionary<string, List<dynamic>>();
           
            var currentsEvents = Sitecore.Context.Database.GetItem("{13388824-92B0-4280-A48D-254F00A5A026}").Children;
            var today = DateTime.Now;

            foreach (Item currentsEvent in currentsEvents.Where(e => 
                        Sitecore.DateUtil.IsoDateToDateTime(e.Fields["Start Date"].Value) > today.AddYears(-5) 
                        && Sitecore.DateUtil.IsoDateToDateTime(e.Fields["End Date"].Value) < today.AddYears(5)
                    ))
            {
                DateTime startDate = Sitecore.DateUtil.IsoDateToDateTime(currentsEvent.Fields["Start Date"].Value);
                DateTime endDate = currentsEvent.Fields["End Date"].Value == "" ? startDate : Sitecore.DateUtil.IsoDateToDateTime(currentsEvent.Fields["End Date"].Value);
                string eventHtml = "<a href=\"\" popover-append-to-body=\"true\"  data-popover-html=\"" + "<div class='grid'><div class='col event-info'>";
                var imageField = (ImageField)currentsEvent.Fields["Event Image"];
                var registrationLink = (LinkField)currentsEvent.Fields["Registration Link"];
                var infoLink = (LinkField)currentsEvent.Fields["Info Link"];
                var mapLocation = currentsEvent.Fields["Map Location"].Value.Replace(" ","+");
                var mapButtonText = currentsEvent.Fields["Map Button Text"].Value;
                var category = currentsEvent.Fields["Event Type"].Value.ToLower();
                var stateField =  (Sitecore.Data.Fields.MultilistField) currentsEvent.Fields["Event State"];
                bool recurringEvent = !string.IsNullOrEmpty(currentsEvent.Fields["Recurring Event"].Value);
                int repeatWeeks =  currentsEvent.Fields["Repeat Every X Weeks"].Value.ToInt();
                bool repeatSunday = !string.IsNullOrEmpty(currentsEvent.Fields["Sunday"].Value);
                bool repeatMonday = !string.IsNullOrEmpty(currentsEvent.Fields["Monday"].Value);
                bool repeatTuesday = !string.IsNullOrEmpty(currentsEvent.Fields["Tuesday"].Value);
                bool repeatWednesday = !string.IsNullOrEmpty(currentsEvent.Fields["Wednesday"].Value);
                bool repeatThursday = !string.IsNullOrEmpty(currentsEvent.Fields["Thursday"].Value);
                bool repeatFriday = !string.IsNullOrEmpty(currentsEvent.Fields["Friday"].Value);
                bool repeatSaturday = !string.IsNullOrEmpty(currentsEvent.Fields["Saturday"].Value);

                var state = new List<string>();
                foreach (Sitecore.Data.ID id in stateField.TargetIDs)
                {
                    state.Add(Sitecore.Context.Database.Items[id].Name);
                } 

                if (imageField.MediaItem != null)
                {
                    eventHtml += "<img src='" + MediaManager.GetMediaUrl(imageField.MediaItem) + "'>" ;
                }
                eventHtml += "<div class='event-heading'><div class='event-title'>" + currentsEvent.Fields["Event Title"].Value + "</div>" +
                "<div class='event-date'>{0}";
                
                eventHtml += "</div><div class='event-location'>" + currentsEvent.Fields["Event Location"].Value + "</div></div>" +
                "<div class='event-summary'>" + currentsEvent.Fields["Event Summary"].Value + "</div>";
                if (!string.IsNullOrEmpty(mapLocation))
                {
                    eventHtml += "</div><div class='col map'><a href='https://www.google.com/maps/dir//" + mapLocation + "' class='view-map' target='_blank'><img src='http://maps.googleapis.com/maps/api/staticmap?center=" + mapLocation + "&zoom=15&scale=false&size=250x250&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C" + mapLocation + "'></a></div></div>";
                }
                eventHtml += "<div class='event-links'>";
                if (!string.IsNullOrEmpty(registrationLink.GetFriendlyUrl()))
                {
                    eventHtml += "<a href='" + registrationLink.GetFriendlyUrl() + "' class='register' target='_blank'>" + registrationLink.Text + "</a>";
                }
                if (!string.IsNullOrEmpty(mapButtonText))
                {
                    eventHtml += "<a href='https://www.google.com/maps/dir//" + mapLocation + "' class='view-map' target='_blank'>" + mapButtonText + "</a>";
                }
                if (!string.IsNullOrEmpty(infoLink.GetFriendlyUrl()))
                {
                    eventHtml += "<a href='" + infoLink.GetFriendlyUrl() + "' class='info' target='_blank'>" + infoLink.Text + "</a>";
                }
                eventHtml += "</div>\"";
                if (category != "")
                {
                    eventHtml += " class='" + category.Replace(" ", "-") + "'";
                }
                eventHtml += ">" + currentsEvent.Fields["Event Title"].Value + "</a>";
                
               if (!recurringEvent)
               {
                   while (startDate <= endDate)
                   {
                       string currentDateString = startDate.ToString(@"MM-dd-yyyy");
                       var htmlDate = startDate.ToString("MMMM d");
                       if (startDate != endDate)
                       {
                           htmlDate += " - ";
                           htmlDate += (startDate.Month == endDate.Month) ? endDate.Day.ToString() : endDate.ToString("MMMM d");
                           htmlDate += ", " + endDate.ToString("yyyy");
                       }
                       else
                       {
                           htmlDate += ", " + startDate.ToString("yyyy");
                       }
                       eventHtml = string.Format(eventHtml, htmlDate);
                       events = AddEvent(events, currentDateString, eventHtml, category, state);
                       startDate = startDate.AddDays(1);
                   }
               }
               else if (repeatWeeks > 0)
               {
                   var currentDate = startDate;
                   var startDayOfWeek = startDate.DayOfWeek;
                   var eventHtmlOrig = eventHtml;
                   while (currentDate <= endDate)
                   {
                       string currentDateString = currentDate.ToString(@"MM-dd-yyyy");
                       string htmlDate = currentDate.ToString("MMMM d, yyyy");
                       eventHtml = string.Format(eventHtmlOrig, htmlDate);
                       switch (currentDate.DayOfWeek)
                       {
                           case DayOfWeek.Sunday:
                               if (repeatSunday)
                               {
                                   events = AddEvent(events, currentDateString, eventHtml, category, state);
                               }
                               break;
                           case DayOfWeek.Monday:
                               if (repeatMonday)
                               {
                                   events = AddEvent(events, currentDateString, eventHtml, category, state);
                               }
                               break;
                           case DayOfWeek.Tuesday:
                               if (repeatTuesday)
                               {
                                   events = AddEvent(events, currentDateString, eventHtml, category, state);
                               }
                               break;
                           case DayOfWeek.Wednesday:
                               if (repeatWednesday)
                               {
                                   events = AddEvent(events, currentDateString, eventHtml, category, state);
                               }
                               break;
                           case DayOfWeek.Thursday:
                               if (repeatThursday)
                               {
                                   events = AddEvent(events, currentDateString, eventHtml, category, state);
                               }
                               break;
                           case DayOfWeek.Friday:
                               if (repeatFriday)
                               {
                                   events = AddEvent(events, currentDateString, eventHtml, category, state);
                               }
                               break;
                           case DayOfWeek.Saturday:
                               if (repeatSaturday)
                               {
                                   events = AddEvent(events, currentDateString, eventHtml, category, state);
                               }
                               break;
                       }

                       currentDate = currentDate.AddDays(1);

                       if (currentDate.DayOfWeek == startDayOfWeek && repeatWeeks > 1)
                       {
                           currentDate = currentDate.AddDays(7 * (repeatWeeks - 1));
                       }
                   }

               }
            }

            return events;
        }

        private Dictionary<string, List<dynamic>> AddEvent(Dictionary<string, List<dynamic>> events, string currentDateString, string eventHtml, string category, List<string> state)
        {
            if (events.ContainsKey(currentDateString))
            {
                events[currentDateString].Add(new { content = eventHtml, category = category, state = state });
            }
            else
            {
                var dailyEvents = new List<dynamic>();
                dailyEvents.Add(new { content = eventHtml, category = category, state = state });
                events.Add(currentDateString, dailyEvents);
            }
            return events;
        }

        [HttpPost]
        public IEnumerable<CalendarEvent> CalendarSearch (CalendarSearchRequest request)
        {
            List<CalendarEvent> listEvents = new List<CalendarEvent>();

            var query = "fast:/sitecore/content/Data/Currents/Calendar Events//*[";
            query += string.Format("(@#Event Title#=\"%{0}%\" or @#Event Summary#=\"%{1}%\"  or @#Event Location#=\"%{2}%\")", request.SearchText, request.SearchText, request.SearchText);
            
            if (!string.IsNullOrEmpty(request.CategoryID))
            {
                query += string.Format("and @#Event Type#=\"%{0}%\"", request.CategoryID);
            }

            if (!string.IsNullOrEmpty(request.State))
            {
                Item stateItem = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/States/" + request.State);

                query += string.Format("and @#Event State#=\"%{0}%\"", stateItem.ID.ToString());
            }

            query += "]";

            var currentsEvents = Sitecore.Context.Database.SelectItems(query);
            var today = DateTime.Now;

            foreach (Item currentsEvent in currentsEvents.Where(e =>
                        Sitecore.DateUtil.IsoDateToDateTime(e.Fields["Start Date"].Value) > today.AddYears(-5)
                        && Sitecore.DateUtil.IsoDateToDateTime(e.Fields["End Date"].Value) < today.AddYears(5)
                    ))
            {
                DateTime startDate = Sitecore.DateUtil.IsoDateToDateTime(currentsEvent.Fields["Start Date"].Value);
                DateTime endDate = currentsEvent.Fields["End Date"].Value == "" ? startDate : Sitecore.DateUtil.IsoDateToDateTime(currentsEvent.Fields["End Date"].Value);
                var imageField = (ImageField)currentsEvent.Fields["Event Image"];
                var registrationLink = (LinkField)currentsEvent.Fields["Registration Link"];
                var infoLink = (LinkField)currentsEvent.Fields["Info Link"];
                var mapLocation = currentsEvent.Fields["Map Location"].Value.Replace(" ", "+");
                var mapButtonText = currentsEvent.Fields["Map Button Text"].Value;
                var category = currentsEvent.Fields["Event Type"].Value;
                var stateField = (Sitecore.Data.Fields.MultilistField)currentsEvent.Fields["Event State"];
                bool recurringEvent = !string.IsNullOrEmpty(currentsEvent.Fields["Recurring Event"].Value);
                int repeatWeeks = currentsEvent.Fields["Repeat Every X Weeks"].Value.ToInt();
                bool repeatSunday = !string.IsNullOrEmpty(currentsEvent.Fields["Sunday"].Value);
                bool repeatMonday = !string.IsNullOrEmpty(currentsEvent.Fields["Monday"].Value);
                bool repeatTuesday = !string.IsNullOrEmpty(currentsEvent.Fields["Tuesday"].Value);
                bool repeatWednesday = !string.IsNullOrEmpty(currentsEvent.Fields["Wednesday"].Value);
                bool repeatThursday = !string.IsNullOrEmpty(currentsEvent.Fields["Thursday"].Value);
                bool repeatFriday = !string.IsNullOrEmpty(currentsEvent.Fields["Friday"].Value);
                bool repeatSaturday = !string.IsNullOrEmpty(currentsEvent.Fields["Saturday"].Value);

                var states = new List<string>();
                foreach (Sitecore.Data.ID id in stateField.TargetIDs)
                {
                    states.Add(Sitecore.Context.Database.Items[id].Name);
                }

                var eventDate = startDate.ToString("MMMM d");
                if (startDate != endDate)
                {
                    eventDate += " - ";
                    eventDate += (startDate.Month == endDate.Month) ? endDate.Day.ToString() : endDate.ToString("MMMM d");
                    eventDate += ", " + endDate.ToString("yyyy");
                }
                else
                {
                    eventDate += ", " + startDate.ToString("yyyy");
                }

                if (!recurringEvent)
                {
                    CalendarEvent e = new CalendarEvent
                    {
                        Title = currentsEvent.Fields["Event Title"].Value,
                        StartDate = startDate.ToString("MMMM d, yyyy"),
                        EndDate = endDate.ToString("MMMM d, yyyy"),
                        EventDate = eventDate,
                        ImageURL = imageField.MediaItem != null ? MediaManager.GetMediaUrl(imageField.MediaItem) : "",
                        Location = currentsEvent.Fields["Event Location"].Value,
                        Summary = currentsEvent.Fields["Event Summary"].Value,
                        MapLocation = mapLocation,
                        Category = category,
                        RegistrationText = !string.IsNullOrEmpty(registrationLink.Text) ? registrationLink.Text : "",
                        RegistrationURL = !string.IsNullOrEmpty(registrationLink.GetFriendlyUrl()) ? registrationLink.GetFriendlyUrl() : "",
                        MapButtonText = !string.IsNullOrEmpty(mapButtonText) ? mapButtonText : "",
                        InfoLinkText = !string.IsNullOrEmpty(infoLink.Text) ? infoLink.Text : "",
                        InfoLinkURL = !string.IsNullOrEmpty(infoLink.GetFriendlyUrl()) ? infoLink.GetFriendlyUrl() : "",
                        States = states,
                    };

                    listEvents.Add(e);
                }
                else if (repeatWeeks > 0)
                {
                   var currentDate = startDate;
                   var startDayOfWeek = startDate.DayOfWeek;
                   while (currentDate <= endDate)
                   {
                       CalendarEvent e = new CalendarEvent
                       {
                           Title = currentsEvent.Fields["Event Title"].Value,
                           StartDate = currentDate.ToString("MMMM d, yyyy"),
                           EndDate = currentDate.ToString("MMMM d, yyyy"),
                           EventDate = currentDate.ToString("MMMM d, yyyy"),
                           ImageURL = imageField.MediaItem != null ? MediaManager.GetMediaUrl(imageField.MediaItem) : "",
                           Location = currentsEvent.Fields["Event Location"].Value,
                           Summary = currentsEvent.Fields["Event Summary"].Value,
                           MapLocation = mapLocation,
                           Category = category,
                           RegistrationText = !string.IsNullOrEmpty(registrationLink.Text) ? registrationLink.Text : "",
                           RegistrationURL = !string.IsNullOrEmpty(registrationLink.GetFriendlyUrl()) ? registrationLink.GetFriendlyUrl() : "",
                           MapButtonText = !string.IsNullOrEmpty(mapButtonText) ? mapButtonText : "",
                           InfoLinkText = !string.IsNullOrEmpty(infoLink.Text) ? infoLink.Text : "",
                           InfoLinkURL = !string.IsNullOrEmpty(infoLink.GetFriendlyUrl()) ? infoLink.GetFriendlyUrl() : "",
                           States = states,
                       };

                       switch (currentDate.DayOfWeek)
                       {
                           case DayOfWeek.Sunday:
                               if (repeatSunday)
                               {
                                   listEvents.Add(e);
                               }
                               break;
                           case DayOfWeek.Monday:
                               if (repeatMonday)
                               {
                                   listEvents.Add(e);
                               }
                               break;
                           case DayOfWeek.Tuesday:
                               if (repeatTuesday)
                               {
                                   listEvents.Add(e);
                               }
                               break;
                           case DayOfWeek.Wednesday:
                               if (repeatWednesday)
                               {
                                   listEvents.Add(e);
                               }
                               break;
                           case DayOfWeek.Thursday:
                               if (repeatThursday)
                               {
                                   listEvents.Add(e);
                               }
                               break;
                           case DayOfWeek.Friday:
                               if (repeatFriday)
                               {
                                   listEvents.Add(e);
                               }
                               break;
                           case DayOfWeek.Saturday:
                               if (repeatSaturday)
                               {
                                   listEvents.Add(e);
                               }
                               break;
                       }

                       currentDate = currentDate.AddDays(1);

                       if (currentDate.DayOfWeek == startDayOfWeek && repeatWeeks > 1)
                       {
                           currentDate = currentDate.AddDays(7 * (repeatWeeks - 1));
                       }
                   }

               }
            }
            return listEvents;

        }

        [HttpGet]
        public HttpResponseMessage CalendarExport()
        {
            DDay.iCal.iCalendar iCal = new DDay.iCal.iCalendar();
            //iCal.Name = "Stream Events";
            iCal.AddLocalTimeZone();

            // Create the event, and add it to the iCalendar
            Event evt = iCal.Create<Event>();

            // Add the events
            var currentsEvents = Sitecore.Context.Database.GetItem("{13388824-92B0-4280-A48D-254F00A5A026}").Children;

            foreach (Item currentsEvent in currentsEvents)
            {
                DateTime startDate = Sitecore.DateUtil.IsoDateToDateTime(currentsEvent.Fields["Start Date"].Value);
                DateTime endDate = currentsEvent.Fields["End Date"].Value == "" ? startDate : Sitecore.DateUtil.IsoDateToDateTime(currentsEvent.Fields["End Date"].Value);

                evt = iCal.Create<Event>();
                evt.Start = new iCalDateTime(startDate);
                evt.End = new iCalDateTime(endDate);
                evt.IsAllDay = true;
                evt.Description = currentsEvent.Fields["Event Summary"].Value;
                evt.Location = currentsEvent.Fields["Event Location"].Value;
                evt.Summary = currentsEvent.Fields["Event Title"].Value;
            }

            // Create a serialization context and serializer factory.
            // These will be used to build the serializer for our object.
            ISerializationContext ctx = new SerializationContext();
            ISerializerFactory factory = new DDay.iCal.Serialization.iCalendar.SerializerFactory();
            // Get a serializer for our object
            IStringSerializer serializer = factory.Build(iCal.GetType(), ctx) as IStringSerializer;

            string output = serializer.SerializeToString(iCal);
            var bytes = Encoding.UTF8.GetBytes(output);

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var stream = new  MemoryStream(bytes);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/calendar");
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
            {
                FileName = "StreamEvents.ics"
            };
         

            return result;
        }

    }
}