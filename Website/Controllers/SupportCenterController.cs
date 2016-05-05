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

namespace StreamEnergy.MyStream.Controllers
{
    public class SupportCenterController : Controller
    {
        #region Sitecore Item And Template IDs
        private string categoryRootItemID = "{8A3629FC-AE99-472F-AFDF-1A1C003C4A12}"; // /sitecore/content/Data/Support/Categories
        private string categoryTemplateID = "{9A6FE321-EC0F-4378-9739-6D0AD2E67B89}"; // /sitecore/templates/User Defined/Taxonomy/Faq Category
        private string subcategoryRootItemID = "{6EE881AD-754B-4E1D-B94B-BDFF1C1D3365}"; // /sitecore/content/Data/Support/Subcategories
        private string subcategoryRootTemplateID = "{C0B03D6C-84B7-4E66-88E0-7D1EF490CCBC}"; // /sitecore/templates/User Defined/Taxonomy/FAQ Subcategory
        private string FAQsRootItemID = "{29E812CF-FC71-4375-8B9C-58863AA0362B}"; // /sitecore/content/Data/Support/FAQs
        private string FAQsTempalteID = "{BE70CAA9-D9B4-40E4-9D54-F2164E0846C9}"; // 	/sitecore/templates/User Defined/Components/Marketing/State FAQ 
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

        private Item FaqSubCategoryRootItem{
            get {
                if (_faqsubcategoryrootitem != null) return _faqsubcategoryrootitem;

                _faqsubcategoryrootitem = Sitecore.Context.Database.GetItem(subcategoryRootItemID);

                return _faqsubcategoryrootitem;
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
                
                _allfaqs = FAQsRootItem.Axes.GetDescendants().Where(a => a.TemplateID.ToString() == FAQsTempalteID).ToList();
                
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

        public List<FaqSubcategory> GetAllSubCategoriesForCategory(FAQCategory category) {
            List<FaqSubcategory> subcategories = new List<FaqSubcategory>();

            var items = FaqSubCategoryRootItem.Axes.GetDescendants().Where(a => a.TemplateID.ToString() == subcategoryRootTemplateID);

            var rawSubcats = items.Where(a => a.Fields["FAQ Categories"] !=null && a.Fields["FAQ Categories"].Value.Contains(category.Guid)).ToList();

            foreach (var sc in rawSubcats) {
                subcategories.Add(new FaqSubcategory(sc));
            }

            return subcategories;
        }

        public List<FAQ> GetAllFaqsForCategory(FAQCategory category) {
            List<FAQ> faqs = new List<FAQ>();
            
            var rawFaqs = AllSitecoreFAQS.Where(a => a.Fields["FAQ Categories"] != null && a.Fields["FAQ Categories"].Value.Contains(category.Guid)).ToList();

            foreach(var f in rawFaqs) {
                faqs.Add(new FAQ(f));
            }

            return faqs;
        }

        public List<FAQ> GetAllFaqsForSubcategory(FaqSubcategory subcategory, FAQCategory category) {
            //A FAQ must have both the category and subcategory to be returned from this call.  One alone does not suffice.

            List<FAQ> faqs = new List<FAQ>();

            var rawFaqs = AllSitecoreFAQS.Where(a => a.Fields["FAQ Categories"] != null && a.Fields["FAQ Categories"].Value.Contains(category.Guid)
                    && a.Fields["FAQ Subcategories"]  != null && a.Fields["FAQ Subcategories"].Value.Contains(subcategory.Guid)).ToList();

            foreach (var f in rawFaqs)
            {
                faqs.Add(new FAQ(f));
            }

            return faqs;
        }

        public List<FAQ> Search(string query) {
            List<FAQ> results = new List<FAQ>();
            List<FAQ> allFAQS = new List<FAQ>();

            query = query.Trim().ToLower(); 
            foreach (Item item in AllSitecoreFAQS) {
                allFAQS.Add(new FAQ(item));
            }

            //These calls can all be run asyncrhonisly and are being extracted out with that in mind
            List<FAQ> faqNameSearch = FAQNameSearch(query, allFAQS);
            List<FAQ> faqDetailsSearch = FAQDetailsSearch(query, allFAQS);
            List<FAQ> catSearch = CategorySearch(query, allFAQS);
            List<FAQ> subSearch = SubcategorySearch(query, allFAQS);
            List<FAQ> keySearch = FAQKeywordSearch(query, allFAQS);

            updateSearchResults(results, faqNameSearch);
            updateSearchResults(results, faqDetailsSearch);
            updateSearchResults(results, catSearch);
            updateSearchResults(results, subSearch);
            updateSearchResults(results, keySearch);
            

            return results;
        }

        #region Internal Search Methods

        private List<FAQ> CategorySearch(string query, List<FAQ> list) {
            return list.Where(a => a.Categories.Any(b => b.DisplayTitle.ToLower() == query)).ToList();

        }

        private List<FAQ> SubcategorySearch(string query, List<FAQ> list) {
            return list.Where(a => a.SubCategories.Any(b => b.DisplayTitle.ToLower() == query)).ToList();
        }

        private List<FAQ> FAQNameSearch(string query, List<FAQ> list) {
            return list.Where(a => a.Name.ToLower().Contains(query)).ToList();
        }

        private List<FAQ> FAQDetailsSearch(string query, List<FAQ> list) {
            return list.Where(a => a.Description.ToLower().Contains(query) 
                            || a.FAQQuestion.ToLower().Contains(query.ToLower())
                            || a.FAQAnswer.ToLower().Contains(query)).ToList();
        }

        private List<FAQ> FAQKeywordSearch(string query, List<FAQ> list) {
            return list.Where(a => a.Keywords.Any(b => b.ToLower() == query)).ToList();
        }

        private List<FAQ> updateSearchResults(List<FAQ> initialSet, List<FAQ> updatedResults)
        {
            if (updatedResults.Count() < 1) return initialSet;

            List<FAQ> results = initialSet;

            foreach (FAQ faq in updatedResults) {
                if (!results.Any(a => a.Guid == faq.Guid)) {
                    results.Add(faq);
                }
            }

            return results;

        }

        #endregion

    }
}