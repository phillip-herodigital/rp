using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using StreamEnergy.DomainModels.Activation;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class MobileActivationController : ApiController
    {
        private readonly IEnrollmentService enrollmentService;
        private readonly IActivationCodeLookup activationCodeLookup;

        public MobileActivationController(IEnrollmentService enrollmentService, IActivationCodeLookup activationCodeLookup)
        {
            this.enrollmentService = enrollmentService;
            this.activationCodeLookup = activationCodeLookup;
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<bool> ActivateEsn([FromBody]string esn)
        {
            esn = await activationCodeLookup.LookupEsn(esn) ?? esn;
            return await enrollmentService.ActivateEsn(esn);
        }

        [HttpPost]
        public async Task<bool> UploadActivationCodes()
        {
            // TODO - is this the right permission?
            if (!Sitecore.Context.User.IsAdministrator && !Sitecore.Context.User.IsInRole("sitecore\\Author"))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
            var text = await Request.Content.ReadAsStringAsync();

            return await activationCodeLookup.UploadCsv(text);
        }
    }
}
