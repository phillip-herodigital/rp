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
using Sitecore.ContentSearch;

using System.Data.SqlClient;
using System.Data;
using Sitecore.ContentSearch.SearchTypes;
using Sitecore.ContentSearch.Security;
using Sitecore.ContentSearch.LuceneProvider;
using Sitecore.ContentSearch.Linq.Utilities;
using Sitecore.Data;
using Sitecore.ContentSearch.Linq;

namespace StreamEnergy.MyStream.Controllers
{
    public class SupportCenterController : Controller
    {
        #region Sitecore Item And Template IDs
        private string supportHomeItemID = "{3F3A2EA8-4590-460D-8A3C-16B38A4FE91E}"; // /sitecore/content/Home/support
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

        public IEnumerable<FAQ> getPopularFAQs() {
            return (from guid in Sitecore.Context.Database.GetItem(supportHomeItemID).Fields["Popular FAQs"].Value.Split("|".ToCharArray())
                   select new FAQ(guid)).ToArray();
        }
 
        public IEnumerable<FAQCategory> GetAllCategories()
        {
            return (from item in Sitecore.Context.Database.GetItem(categoryRootItemID).Children
                    where item.TemplateID.ToString() == categoryTemplateID
                    select new FAQCategory(item)).ToArray();
        }

        public void WasFAQHelpful(string guid, bool isHelpful, string Comment)
        {
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

        public IEnumerable<FaqSubcategory> GetAllSubCategories()
        {
            return (from subcategory in Sitecore.Context.Database.GetItem(subcategoryRootItemID).Axes.GetDescendants()
                    where subcategory.TemplateID.ToString() == subcategoryRootTemplateID
                    select new FaqSubcategory(subcategory)).ToArray();
        }

        public IEnumerable<FaqSubcategory> GetAllSubCategoriesForCategory(string categoryGuid)
        {
            return (from subcategory in GetAllSubCategories()
                    where subcategory.Categories.Contains(categoryGuid)
                    select subcategory).ToArray();
        }

        public IEnumerable<FAQState> GetAllStates()
        {
            return (from state in Sitecore.Context.Database.GetItem(FAQStateRootItemID).Axes.GetDescendants()
                    where state.TemplateID.ToString() == FAQStateTemplateID
                    select new FAQState(state)).ToArray();
        }

        public IEnumerable<FAQ> Search(string query, FaqSearchFilter filter) {
            query = (query ?? "").Trim().ToLower();
            List<string> categories = (from c in GetAllCategories() select c.Name).ToList();
            List<string> subCategories = (from s in GetAllSubCategoriesForCategory(filter.Category.Guid) select s.Name).ToList();
            var faqsTemplateID = ID.Parse(FAQsTempalteID);
            var stateFAQsTempalteID = ID.Parse(StateFAQsTempalteID);
            var filterCategoryID = Sitecore.ContentSearch.Utilities.IdHelper.NormalizeGuid(filter.Category.Guid, true);

            Item repositorySearchItem = Sitecore.Context.Database.GetItem(FAQsRootItemID);
            ISearchIndex index = ContentSearchManager.GetIndex(new SitecoreIndexableItem(repositorySearchItem));
            using (IProviderSearchContext context = index.CreateSearchContext(SearchSecurityOptions.EnableSecurityCheck))
            {
                var luceneSearchContext = context as LuceneSearchContext;

                // use False because we'll be ANDing this clause together
                var filterPredicate = PredicateBuilder.True<SearchResultItem>()
                    .And(item => item.TemplateId == faqsTemplateID || item.TemplateId == stateFAQsTempalteID)
                    .And(item => item["FAQ Categories"].Contains(filterCategoryID))
                    .And(item => item.Language == Sitecore.Context.Language.Name);
                if (filter.State != null)
                {
                    filterPredicate = filterPredicate
                        .And(item => item.TemplateId == faqsTemplateID || item["FAQ States"].Contains(Sitecore.ContentSearch.Utilities.IdHelper.NormalizeGuid(filter.State.Guid, true)));
                }
            
                var terms = query.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                // use False because we'll be ORing this clause together
                var termPredicate = PredicateBuilder.False<SearchResultItem>();

                foreach (var term in terms)
                {
                    termPredicate = termPredicate
                        .Or(item => item["FAQ Question"].Contains(term)).Boost(3)
                        .Or(item => item["FAQ Answer"].Contains(term))
                        .Or(item => item["Keywords"].Contains(term)).Boost(2)
                        .Or(item => categories.Contains(term)).Boost(1)
                        .Or(item => subCategories.Contains(term)).Boost(1);
                }

                if (query != "")
                {
                    filterPredicate = filterPredicate.And(termPredicate);
                }

                var luceneQuery = context.GetQueryable<SearchResultItem>().Where(filterPredicate);

                return (from result in luceneQuery
                        select new FAQ(result.GetItem())).ToList();
            }
        }
    }
}