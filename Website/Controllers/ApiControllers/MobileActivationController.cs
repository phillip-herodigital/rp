using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class MobileActivationController : ApiController
    {
        private IEnrollmentService enrollmentService;

        public MobileActivationController(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<bool> ActivateEsn([FromBody]string esn)
        {
            // TODO - check if esn is an activation code somehow
            return await enrollmentService.ActivateEsn(esn);
        }
    }
}
