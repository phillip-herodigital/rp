using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using StreamEnergy.DomainModels.MobileEnrollment;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/MobileEnrollment")]
    public class MobileEnrollmentController : ApiController
    {
        private readonly IMobileEnrollmentService mobileEnrollment;
        private readonly IW9GenerationService w9Generator;

        public MobileEnrollmentController(IMobileEnrollmentService mobileEnrollment, IW9GenerationService w9Generator)
        {
            this.mobileEnrollment = mobileEnrollment;
            this.w9Generator = w9Generator;
        }

        [HttpPost]
        public async Task<IHttpActionResult> Submit(UserContext context)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var w9Pdf = w9Generator.GenerateW9(context.BusinessInformationName, context.BusinessName, context.BusinessTaxClassification, context.AdditionalTaxClassification, context.ExemptCode, context.FATCACode, context.BusinessAddress, context.SocialSecurityNumber, context.TaxId, context.CustomerSignature, DateTime.Now);
            var result = await mobileEnrollment.RecordEnrollment(context, w9Pdf);

            if (result != Guid.Empty)
            {
                return Ok(new { Success = true, Id = result });
            }
            else
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("w9/{id}")]
        public async Task<HttpResponseMessage> DownloadW9(Guid id)
        {
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var stream = new MemoryStream(await mobileEnrollment.RetrievePdf(id));
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
            return result;
        }
    }
}
