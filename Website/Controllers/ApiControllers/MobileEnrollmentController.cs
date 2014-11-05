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

        [HttpPost]
        public async Task<IHttpActionResult> Submit(UserContext context)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await mobileEnrollment.RecordEnrollment(context);

            if (result)
            {
                return Ok(new { Success = true });
            }
            else
            {
                return InternalServerError();
            }
        }
    }
}
