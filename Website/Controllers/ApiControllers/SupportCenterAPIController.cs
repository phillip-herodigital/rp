using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StreamEnergy.MyStream.Models.Marketing.Support;
using StreamEnergy.MyStream.Controllers;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/support")]
    public class SupportCenterAPIController : ApiController
    {
        SupportCenterController controller = new SupportCenterController();

        [HttpPost]
        [Route("categoryInit")]
        public InitResponse CategoryInit(SearchRequest request)
        {
            return new InitResponse
            {
                Categories = controller.GetAllCategories(),
                Subcategories = controller.GetAllSubCategoriesForCategory(request.Category),
                FAQs = Search(request)
            };
        }

        [HttpGet]
        [Route("contactInit")]
        public IEnumerable<FAQCategory> ContactInit(SearchRequest request)
        {
            return controller.GetAllCategories();
        }

        [HttpGet]
        [Route("init")]
        public InitResponse Init()
        {
            var result = new InitResponse {
                FAQs = controller.getPopularFAQs(),
                Categories = controller.GetAllCategories()
            };
            return result;
        }

        [HttpPost]
        [Route("search")]
        public IEnumerable<FAQ> Search(SearchRequest searchRequest) {
            FaqSearchFilter filter = new FaqSearchFilter();
            var query = HttpUtility.HtmlEncode(searchRequest.Query);
            var category = searchRequest.Category;
            var state = searchRequest.State;

            if (!string.IsNullOrEmpty(category))
            {
                filter.Category = (from categoryItem in controller.GetAllCategories()
                                   where categoryItem.Guid == category
                                   select categoryItem).FirstOrDefault();
            }

            if (!string.IsNullOrEmpty(state))
            {

                filter.State = (from stateItem in controller.GetAllStates()
                                where stateItem.Guid == state
                                select stateItem).FirstOrDefault();
            }

            return controller.Search(query, filter);
        }

        [HttpPost]
        [Route("sendFeedback")]
        public SupportFeedbackResponse SendFeedback(SupportFeedback feedback)
        {
            SupportFeedbackResponse result = new SupportFeedbackResponse {
                Success = true,
                Validations = new List<string>()
            };

            try
            {
                controller.WasFAQHelpful(feedback.guid, feedback.isHelpful, !string.IsNullOrEmpty(feedback.comment) ? feedback.comment : "");
            }
            catch (Exception ex) {
                result.Success = false;
                result.Validations.Add(ex.Message);
            }
            
            return result;
        }
    }
}