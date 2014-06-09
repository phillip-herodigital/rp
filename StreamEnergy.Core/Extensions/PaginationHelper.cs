using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Web;

namespace StreamEnergy.Extensions
{
    public class PaginationHelper<T>
    {
        #region Properties
        public string PageVariable { get; private set; }
        public string NonPageQueryParameters { get; private set; }
        public IEnumerable<T> AllItems { get; private set; }
        public int MaxPage { get; private set; }
        public int CurrentPage { get; private set; }
        public int ItemsPerPage { get; private set; }
        public int NumPagesToShowInNavigation { get; private set; }
        public IEnumerable<int> PagesToShowInNavigation
        {
            get
            {
                var start = 1;
                var pagesBefore = CurrentPage - 1;
                if (MaxPage - CurrentPage < NumPagesToShowInNavigation / 2)
                {
                    start = MaxPage - NumPagesToShowInNavigation + 1;
                }
                else if (CurrentPage - NumPagesToShowInNavigation / 2 < 1)
                {
                    start = 1;
                }
                else
                {
                    start = (int)Math.Ceiling((decimal)CurrentPage - (NumPagesToShowInNavigation-1) / 2);
                }
                if (start < 1) start = 1;
                
                for(var i=start; i<start+NumPagesToShowInNavigation && i<=MaxPage; i++)
                {
                    yield return i;
                }
            }
        }
        public IEnumerable<T> CurrentItems
        {
            get
            {
                return AllItems.Skip((CurrentPage - 1) * ItemsPerPage).Take(ItemsPerPage);
            }
        }
        public bool HasNext
        {
            get
            {
                return (CurrentPage < MaxPage);
            }
        }
        public bool HasPrevious
        {
            get
            {
                return (CurrentPage > 1);
            }
        }
        public int StartPosition
        {
            get
            {
                return (CurrentPage - 1) * ItemsPerPage + 1;
            }
        }
        public int EndPosition
        {
            get
            {
                return StartPosition + CurrentItems.Count() - 1;
            }
        }
        #endregion

        public PaginationHelper(IEnumerable<T> items, int page = -1, int itemsPerPage = 10, int numPagesToShowInNavigation = 4, string pageVariable = "page")
        {
            this.AllItems = items;
            this.ItemsPerPage = itemsPerPage;
            this.PageVariable = pageVariable;
            this.MaxPage = this.AllItems.Count() == 0 ? 1 : (int)Math.Ceiling((decimal)this.AllItems.Count() / this.ItemsPerPage);
            this.NumPagesToShowInNavigation = numPagesToShowInNavigation;

            if (page == -1 && int.TryParse(System.Web.HttpContext.Current.Request.QueryString[this.PageVariable], out page))
            {
                this.CurrentPage = page;
            }
            else if (page < 1)
            {
                this.CurrentPage = 1;
            }

            var nonPageQueryParameters = new List<string>();
            var queryString = System.Web.HttpContext.Current.Request.QueryString;
            foreach (string key in queryString.Keys)
            {
                if (key == this.PageVariable) continue;
                nonPageQueryParameters.Add(key + "=" + queryString[key]);
            }
            NonPageQueryParameters = string.Join("&", nonPageQueryParameters);
        }
        public string GetQueryString(int page)
        {
            return "?" + (!string.IsNullOrEmpty(NonPageQueryParameters) ? NonPageQueryParameters + "&" : "") + PageVariable + "=" + page;
        }
        public HtmlString GetPaginationHtml()
        {
            var str = @"<div class=""pagination"">
                <p class=""showing"">
                    {ShowingText} <strong>{StartPosition}-{EndPosition}</strong> {OfText} <strong>{NumberOfItems}</strong> {ItemsText}
                </p>
                <ul class=""page-selection"">
                    <li class=""{FirstClass}""><a href=""{FirstHref}""><i class=""icon-arrow-left""></i> {FirstText}</a></li>
                    <li class=""{PreviousClass}""><a href=""{PreviousHref}""><i class=""icon-arrow-left""></i> {PreviousText}</a></li>
                    {PageLinks}
                    <li class=""{NextClass}""><a href=""{NextHref}"">{NextText} <i class=""icon-arrow-right""></i></a></li>
                    <li class=""{LastClass}""><a href=""{LastHref}"">{LastText} <i class=""icon-arrow-right""></i></a></li>
                </ul>
            </div>";

            var pageLinks = "";
            foreach(var i in PagesToShowInNavigation)
            {
                pageLinks += string.Format(@"<li class=""page-number""><a href=""{0}""{1}>{2}</a></li>", this.GetQueryString(i), i == this.CurrentPage ? @"class=""selected""" : "", i);
            }
            var parameters = new
            {
                ShowingText = "Showing",
                OfText = "of",
                StartPosition = this.StartPosition,
                EndPosition = this.EndPosition,
                NumberOfItems = this.AllItems.Count(),
                ItemsText = "Items",
                FirstText = "First",
                PreviousText = "Previous",
                NextText = "Next",
                LastText = "Last",
                FirstClass = this.CurrentPage < 2 ? "disabled" : "",
                PreviousClass = this.CurrentPage < 2 ? "disabled" : "",
                NextClass = this.CurrentPage >= this.MaxPage ? "disabled" : "",
                LastClass = this.CurrentPage >= this.MaxPage ? "disabled" : "",
                FirstHref = this.CurrentPage < 2 ? "javascript:void(0);" : this.GetQueryString(1),
                PreviousHref = this.CurrentPage < 2 ? "javascript:void(0);" : this.GetQueryString(this.CurrentPage - 1),
                NextHref = this.CurrentPage >= this.MaxPage ? "javascript:void(0);" : this.GetQueryString(this.CurrentPage + 1),
                LastHref = this.CurrentPage >= this.MaxPage ? "javascript:void(0);" : this.GetQueryString(this.MaxPage),
                PageLinks = pageLinks,
            };
            
            foreach (PropertyDescriptor prop in TypeDescriptor.GetProperties(parameters))
            {
                str = str.Replace("{" + prop.Name + "}", (prop.GetValue(parameters) ?? "").ToString());
            }

            return new HtmlString(str);
        }
    }
}
