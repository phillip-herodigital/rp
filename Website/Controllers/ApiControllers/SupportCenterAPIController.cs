using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StreamEnergy.MyStream.Models.Marketing.Support;
using StreamEnergy.MyStream.Controllers;

using System.Threading.Tasks;
namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/support")]
    public class SupportCenterAPIController : ApiController
    {
        private SupportCenterController _controller;
        private SupportCenterController controller {
            get {
                if (_controller == null) _controller = new SupportCenterController();
                
                return _controller;
            }
        }
        [HttpGet]
        [Route("search/{query}/{category}/{state}/{subcategory}")]
        public List<FAQ> Get(string query, string category, string state, string subcategory) {
            FaqSearchFilter filter = new FaqSearchFilter();

            query = System.Web.HttpUtility.UrlDecode(query);

            if (!string.IsNullOrEmpty(category)) {
                try {
                    var cats = controller.GetAllCategories();

                    filter.Category = cats.FirstOrDefault(a => a.DisplayTitle.ToLower() == category.ToLower()
                                                || a.Guid == category);
                }
                catch { }
            }

            if (!string.IsNullOrEmpty(state)) {
                try {
                    var states = controller.GetAllStates();
                    state = state.ToLower().Trim();

                    filter.State = states.FirstOrDefault(a => a.Abbreviation.ToLower() == state || a.Name.ToLower() == state || a.Guid.ToLower() == state);
                }
                catch { }
            }

            if (!string.IsNullOrEmpty(subcategory)) {
                try {
                    var subcats = controller.GetAllSubCategories();
                    filter.Subcategory = subcats.FirstOrDefault(a => a.Name == subcategory || a.DisplayTitle == subcategory || a.Guid == subcategory);
                }
                catch { }
            }

            return controller.Search(query, filter);
        }


        [HttpGet]
        [Route("helpful/{guid}/{helpful}/{comment}")]
        public async Task<bool> LookupZip(string guid, string helpful, string comment)
        {
            try
            {
                FAQ faq = new FAQ(guid);
                bool isHelpful = bool.Parse(helpful);
                comment = !string.IsNullOrEmpty(comment) && comment.Trim() !="-" ? comment : "";
                controller.WasFAQHelpful(faq, isHelpful, comment);
            }
            catch (Exception ex) {
                return false;
            }
            
            return true;
        }
    }
}