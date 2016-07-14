﻿using System;
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
            //List<FAQ> PopFAQs = new List<FAQ>();
            //var popularFAQs = Sitecore.Context.Database.GetItem(supportHomeItemID).Fields["Popular FAQs"].Value;
            //if (!string.IsNullOrEmpty(popularFAQs))
            //{
            //    foreach (string guid in popularFAQs.Split("|".ToCharArray()))
            //    {
            //        PopFAQs.Add(new FAQ(guid));
            //    }
            //}
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
            query = query.Trim().ToLower();
            List<FAQ> matchingFAQS = new List<FAQ>();
            var categories = GetAllCategories();
            var subCategories = GetAllSubCategories();
            //var allFAQs = (from item in Sitecore.Context.Database.SelectItems("/sitecore/content/Data/Components/Support/FAQs//*")
            //               where item.TemplateID.ToString() == FAQsTempalteID || item.TemplateID.ToString() == StateFAQsTempalteID
            //               where item.Fields["FAQ Categories"].Value.Contains(filter.Category.Guid) 
            //               select new FAQ(item)).ToArray();
            var allFAQs = (from item in Sitecore.Context.Database.GetItem(FAQsRootItemID).Axes.GetDescendants()
                           where item.TemplateID.ToString() == FAQsTempalteID || item.TemplateID.ToString() == StateFAQsTempalteID
                           where item.Fields["FAQ Categories"].Value.Contains(filter.Category.Guid)
                           select new FAQ(item)).ToList();

            foreach (FAQ faq in allFAQs)
            {
                //if (filter.Category != null && !faq.Categories.Contains(filter.Category.DisplayTitle + "|" + filter.Category.Guid))
                //{
                //    continue;
                //}
                if (filter.Subcategory != null && !faq.SubCategories.Contains(filter.Subcategory.Guid))
                {
                    continue;
                }
                if (filter.State != null && !faq.States.Contains(filter.State.Guid))
                {
                    continue;
                }
                if (
                    faq.Name.ToLower().Contains(query) ||
                    faq.FAQQuestion.ToLower().Contains(query) ||
                    faq.FAQAnswer.ToLower().Contains(query) ||
                    categories.Any(c => faq.Categories.Contains(c.Guid) && c.DisplayTitle.ToLower().Contains(query)) ||
                    subCategories.Any(s => faq.Categories.Contains(s.Guid) && s.DisplayTitle.ToLower().Contains(query)) ||
                    faq.Keywords.Any(k => k.ToLower().Contains(query))
                    )
                {
                    matchingFAQS.Add(faq);
                }
            }
            return matchingFAQS;
        }
    }
}