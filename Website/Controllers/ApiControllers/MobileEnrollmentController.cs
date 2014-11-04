using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using StreamEnergy.DomainModels.MobileEnrollment;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class MobileEnrollmentController : ApiController
    {
        private readonly IMobileEnrollmentService mobileEnrollment;

        public MobileEnrollmentController(IMobileEnrollmentService mobileEnrollment)
        {
            this.mobileEnrollment = mobileEnrollment;
        }

        [HttpGet]
        public IHttpActionResult Temp()
        {
            return Ok("Success");
        }

        [HttpPost]
        public async Task<IHttpActionResult> Submit()
        {
            await Task.Yield();

            // TODO

            return InternalServerError(new NotImplementedException());
        }
    }
}
