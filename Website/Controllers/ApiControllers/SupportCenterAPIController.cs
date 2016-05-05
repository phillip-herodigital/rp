using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StreamEnergy.MyStream.Models.Marketing.Support;
using StreamEnergy.MyStream.Controllers;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/support")]
    public class SupportCenterAPIController : ApiController
    {
        [HttpGet]
        [Route("search/{keyword}")]
        public List<FAQ> Get(string keyword) {
            return new SupportCenterController().Search(keyword);
        }
    }
}