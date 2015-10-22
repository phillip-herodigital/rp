using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using ResponsivePath.Logging;
using StreamEnergy.MyStream.Models.Logger;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [System.Web.Http.RoutePrefix("api/logRecorder")]
    public class LogRecorderController : ApiController
    {

        private readonly IUnityContainer container;
        private readonly ILogger logger;

        public LogRecorderController(IUnityContainer container, ILogger logger)
        {
            this.container = container;
            this.logger = logger;
        }

        [System.Web.Mvc.HttpPost]
        [System.Web.Mvc.Route("record")]
        public async Task<bool> Record(LogRecorderRequest request)
        {
            if (string.IsNullOrEmpty(request.Message))
            {
                Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Message is required");
                return false;
            }
            else
            {
                var dataDict = new Dictionary<string, object>();
                dataDict.Add("logData", request.Data); 
                await logger.Record(request.Message, request.Severity, dataDict);
                return true;
            }
        }
    }
}