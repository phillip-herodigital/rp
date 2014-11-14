using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Account;
using StreamEnergy.MyStream.Models.Angular.GridTable;
using StreamEnergy.MyStream.Models.Authentication;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using Microsoft.Practices.Unity;
using System.Threading.Tasks;
using ResponsivePath.Validation;
using Sitecore.Links;
using StreamEnergy.MyStream.Models.Temp;
using System.IO;
using System.Net.Http.Headers;
using System.Text;
using StreamEnergy.DomainModels.MobileEnrollment;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    
    public class TempController : ApiController, IRequiresSessionState
    {
        IW9GenerationService pdfGenerationService;
        public TempController(IW9GenerationService pdfGenerationService)
        {
            this.pdfGenerationService = pdfGenerationService;
        }

        //[HttpPost]
        //public dynamic GenerateW9([FromBody]GenerateW9 request)
        //{
        //    HttpContext.Current.Session["W9_Params"] = request;
        //    return new {
        //        url = "/api/temp/downloadW9"
        //    };
        //}

        //[HttpGet]
        //public HttpResponseMessage DownloadW9()
        //{
        //    var request = (GenerateW9)HttpContext.Current.Session["W9_Params"];
        //    var response = pdfGenerationService.GenerateW9(request.Name, request.BusinessName, request.BusinessClassification, request.BusinessTypeAdditional, request.IsExempt, request.Address, request.City, request.State, request.Zip, request.SocialSecurityNumber, request.EmployerIdentificationNumber, request.Signature, DateTime.Now);
        //    HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
        //    var stream = new MemoryStream(response);
        //    result.Content = new StreamContent(stream);
        //    result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        //    return result;
        //}
    }
}