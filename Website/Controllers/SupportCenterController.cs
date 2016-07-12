using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.Web.Mvc;
using StreamEnergy.MyStream.Models.Marketing.Support;
using Sitecore.Data.Items;
using System.Data.SqlClient;
using System.Data;
namespace StreamEnergy.MyStream.Controllers
{
    public class SupportCenterController : Controller
    {
        #region Sitecore Item And Template IDs
        private string categoryRootItemID = "{8A3629FC-AE99-472F-AFDF-1A1C003C4A12}"; // /sitecore/content/Data/Support/Categories
        private string categoryTemplateID = "{9A6FE321-EC0F-4378-9739-6D0AD2E67B89}"; // /sitecore/templates/User Defined/Components/Support/Faq Category
        private string subcategoryRootItemID = "{6EE881AD-754B-4E1D-B94B-BDFF1C1D3365}"; // /sitecore/content/Data/Support/Subcategories
        private string subcategoryRootTemplateID = "{C0B03D6C-84B7-4E66-88E0-7D1EF490CCBC}"; // /sitecore/templates/User Defined/Components/Support/FAQ Subcategory
        private string FAQsRootItemID = "{29E812CF-FC71-4375-8B9C-58863AA0362B}"; // /sitecore/content/Data/Support/FAQs
        private string FAQsTempalteID = "{91C1C9DB-210B-4B2B-8A3C-D83EF33D284C}"; // 	/sitecore/templates/User Defined/Components/Support/FAQ
        private string StateFAQsTempalteID = "{BE70CAA9-D9B4-40E4-9D54-F2164E0846C9}"; // 	/sitecore/templates/User Defined/Components/Support/State FAQ
        private string FAQStateRootItemID = "{1275AE28-0537-455B-A89F-C28467219351}"; // /sitecore/content/Data/Taxonomy/Modules/States
        private string FAQStateTemplateID = "{FAD51EE9-1FCC-4A16-B0EA-07CA91C92E46}"; // /sitecore/templates/User Defined/Taxonomy/State
        #endregion
        private Item _categoryrootitem;

        private Item categoryRootItem {
            get {
                if (_categoryrootitem != null) return _categoryrootitem;

                _categoryrootitem = Sitecore.Context.Database.GetItem(categoryRootItemID);

                return _categoryrootitem;
            }
        }

        private Item _faqsubcategoryrootitem;

        private Item FaqSubCategoryRootItem {
            get {
                if (_faqsubcategoryrootitem != null) return _faqsubcategoryrootitem;

                _faqsubcategoryrootitem = Sitecore.Context.Database.GetItem(subcategoryRootItemID);

                return _faqsubcategoryrootitem;
            }
        }

        private Item _faqstaterootitem;

        private Item FaqStateRootItem {
            get {
                if (_faqstaterootitem != null) return _faqstaterootitem;

                _faqstaterootitem = Sitecore.Context.Database.GetItem(FAQStateRootItemID);

                return _faqstaterootitem;
            }
        }

        private Item _faqsrootitem;
        private Item FAQsRootItem {
            get {
                if (_faqsrootitem != null) return _faqsrootitem;

                _faqsrootitem = Sitecore.Context.Database.GetItem(FAQsRootItemID);

                return _faqsrootitem;
            }
        }

        private List<Item> _allfaqs;
        private List<Item> AllSitecoreFAQS {
            //This will ultimately be stored into a short term cache to limit the loading of caches for each type

            get {
                if (_allfaqs != null) return _allfaqs;

                _allfaqs = FAQsRootItem.Axes.GetDescendants().Where(a => a.TemplateID.ToString() == FAQsTempalteID || a.TemplateID.ToString() == StateFAQsTempalteID).ToList();

                return _allfaqs;
            }
        }

        public List<FAQCategory> GetAllCategories()
        {
            List<FAQCategory> categories = new List<FAQCategory>();

            var items = categoryRootItem.Children.Where(a => a.TemplateID.ToString() == categoryTemplateID);

            foreach (var item in items) {
                categories.Add(new FAQCategory(item));
            }

            return categories;
        }

        public void WasFAQHelpful(string guid, bool isHelpful, string Comment)
        {
            //Do something here once we have what the helpul logic is

            string ConnectionString = Sitecore.Configuration.Settings.GetConnectionString("core");

            if (string.IsNullOrEmpty(Comment)) Comment = "";

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        INSERT INTO dbo.Helpful_FAQs
                            (
                                FaqGuid,
                                Helpful,
                                Comment,
                                Timestamp
                            ) 
                        VALUES
                            (
                                @FaqGuid,
                                @WasHelpful,
                                @FaqComment,
                                @Timestamp
                            )";

                    SqlParameter parameter = new SqlParameter("@FaqGuid", SqlDbType.VarChar);
                    parameter.Value = guid;
                    command.Parameters.Add(parameter);

                    /*parameter = new SqlParameter("@ID,", SqlDbType.VarChar);
                    parameter.Value = Guid.NewGuid().ToString();
                    command.Parameters.Add(parameter);
                    */

                    parameter = new SqlParameter("@WasHelpful", SqlDbType.Bit);
                    parameter.Value = isHelpful;
                    command.Parameters.Add(parameter);

                    parameter = new SqlParameter("@FaqComment", SqlDbType.VarChar);
                    parameter.Value = Comment.ToLower();
                    command.Parameters.Add(parameter);

                    parameter = new SqlParameter("@Timestamp", SqlDbType.DateTime);
                    parameter.Value = DateTime.Now;
                    command.Parameters.Add(parameter);

                    command.ExecuteNonQuery();
                }
            }
        }

        public List<FaqSubcategory> GetAllSubCategories() {
            List<FaqSubcategory> subcategories = new List<FaqSubcategory>();

            var items = FaqSubCategoryRootItem.Axes.GetDescendants().Where(a => a.TemplateID.ToString() == subcategoryRootTemplateID);

            foreach (var sc in items)
            {
                subcategories.Add(new FaqSubcategory(sc));
            }

            return subcategories;
        }
        
        public List<FaqSubcategory> GetAllSubCategoriesForCategory(string categoryGuid) {
            List<FaqSubcategory> subcategories = GetAllSubCategories()
                .Where(a => a.Categories.Any(b => b == categoryGuid)).ToList();
            return subcategories;
        }

        public List<FAQState> GetAllStates() {
            List<FAQState> states = new List<FAQState>();
            var items = FaqStateRootItem.Axes.GetDescendants().Where(a => a.TemplateID.ToString() == FAQStateTemplateID);
            
            foreach (Item item in items) {
                states.Add(new FAQState(item));
            }

            return states;
        }

        public SearchResponse GetAllFaqsForCategory(string categoryGuid, int startRowIndex, int maximumRows) {

            FAQCategory category = new FAQCategory(Sitecore.Context.Database.GetItem(categoryGuid));
            var filter = new FaqSearchFilter {
                Category = category,
                StartRowIndex = startRowIndex,
                MaximumRows = maximumRows
            };

            return Search("", filter);
        }

        public SearchResponse Search(string query) {
            return Search(query, null);
        }

        public SearchResponse Search(string query, FaqSearchFilter filter) {
            List<FAQ> matchingFAQS = new List<FAQ>();
            var categories = GetAllCategories();
            var subCategories = GetAllSubCategories();

            query = query.Trim().ToLower();
            foreach (Item item in AllSitecoreFAQS) {
                var faq = new FAQ(item);
                if (filter.Category != null && !faq.Categories.Contains(filter.Category.DisplayTitle + "|" + filter.Category.Guid))
                {
                    continue;
                }
                if (filter.Subcategory != null && !faq.SubCategories.Contains(filter.Subcategory.Guid))
                {
                    continue;
                }
                if (filter.State != null && !faq.States.Contains(filter.State.Guid))
                {
                    continue;
                }
                if (filter.Keyword != null && !faq.Keywords.Contains(filter.Keyword))
                {
                    continue;
                }
                if (
                    faq.Name.ToLower().Contains(query) ||
                    faq.Description.ToLower().Contains(query) ||
                    faq.FAQQuestion.ToLower().Contains(query) ||
                    faq.FAQAnswer.ToLower().Contains(query) ||
                    categories.Any(c => faq.Categories.Contains(c.Guid) && c.DisplayTitle.ToLower().Contains(query)) ||
                    subCategories.Any(s => faq.Categories.Contains(s.Guid) && s.DisplayTitle.ToLower().Contains(query)) ||
                    faq.Keywords.Any(k => k.ToLower().Contains(query))
                    )
                {

                    matchingFAQS.Add(new FAQ(item));
                }
            }
            return new SearchResponse {
                FAQs = matchingFAQS.Take(filter.MaximumRows).Skip(filter.StartRowIndex).ToList(),
                FAQCount = matchingFAQS.Count(),
                Keywords = (from faq in matchingFAQS
                            from keyword in faq.Keywords
                            select keyword).Distinct().ToArray()
            };
        }

    }
}