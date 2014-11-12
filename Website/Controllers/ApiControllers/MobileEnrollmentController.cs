using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Text.RegularExpressions;
using Sitecore.Data.Items;
using Sitecore.Data.Fields;
using StreamEnergy.DomainModels.Emails;
using StreamEnergy.DomainModels.MobileEnrollment;
using Microsoft.VisualBasic.FileIO;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/MobileEnrollment")]
    public class MobileEnrollmentController : ApiController
    {
        private readonly IMobileEnrollmentService mobileEnrollment;
        private readonly IW9GenerationService w9Generator;
        private readonly IEmailService emailService;
        private readonly ISettings settings;

        public MobileEnrollmentController(IMobileEnrollmentService mobileEnrollment, IW9GenerationService w9Generator, IEmailService emailService, ISettings settings)
        {
            this.mobileEnrollment = mobileEnrollment;
            this.w9Generator = w9Generator;
            this.emailService = emailService;
            this.settings = settings;
        }

        [HttpPost]
        public async Task<IHttpActionResult> Submit(UserContext context)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var w9Pdf = w9Generator.GenerateW9(context.BusinessInformationName, context.BusinessName, context.BusinessTaxClassification, context.AdditionalTaxClassification, context.ExemptCode, context.FatcaCode, context.BusinessAddress, context.SocialSecurityNumber, context.TaxId, context.SignatureImage, DateTime.Now);
            var result = await mobileEnrollment.RecordEnrollment(context, w9Pdf);

            var emailTemplate = new Guid("{3F7959FA-8578-470D-963F-4AFE8FCAB66F}");

            await emailService.SendEmail(emailTemplate, settings.GetSettingsValue("Marketing Form Email Addresses", "Mobile Enrollment Email Address"), new System.Collections.Specialized.NameValueCollection ()
            {
                { "DeviceMake", context.DeviceMake },    
                { "DeviceModel", context.DeviceModel },    
                { "DeviceSerial", context.DeviceSerial },    
                { "SimNumber", context.SimNumber },    
                { "NewNumber", (!string.IsNullOrEmpty(context.NewNumber)) ? context.NewNumber : "" },    
                { "PortInNumber", (!string.IsNullOrEmpty(context.PortInNumber)) ? context.PortInNumber : "" },    
                { "PlanId", context.PlanId }, 
                { "AssociateId", (!string.IsNullOrEmpty(context.AssociateId)) ? context.AssociateId : "" },
                { "Name", context.ContactInfo.Name.First + " " + context.ContactInfo.Name.Last },    
                { "Phone", context.ContactInfo.Phone.First().Number },    
                { "Email", context.ContactInfo.Email.Address },    
                { "BillingAddress", context.BillingAddress.ToString() },    
                { "ShippingAddress", context.ShippingAddress.ToString() },    
                { "ShippingAddressSame", context.ShippingAddressSame.ToString() },    
                { "BusinessAddress", context.BusinessAddress.ToString() },    
                { "BusinessAddressSame", context.BusinessAddressSame.ToString() },    
                { "BusinessInformationName", context.BusinessInformationName },    
                { "BusinessName", (!string.IsNullOrEmpty(context.BusinessName)) ? context.BusinessName : "" },    
                { "BusinessTaxClassification", context.BusinessTaxClassification.ToString() },    
                { "AdditionalTaxClassification", (!string.IsNullOrEmpty(context.AdditionalTaxClassification)) ? context.AdditionalTaxClassification : "" },    
                { "ExemptCode", (!string.IsNullOrEmpty(context.ExemptCode)) ? context.ExemptCode : "" },    
                { "FatcaCode", (!string.IsNullOrEmpty(context.FatcaCode)) ? context.FatcaCode : "" },    
                { "CurrentAccountNumbers", (!string.IsNullOrEmpty(context.CurrentAccountNumbers)) ? context.CurrentAccountNumbers : "" },    
                { "CustomerCertification", context.CustomerCertification.ToString() },    
                { "CustomerSignature", context.CustomerSignature },    
                { "SignatureConfirmation", context.SignatureConfirmation.ToString() },    
                { "SignatoryName", (!string.IsNullOrEmpty(context.SignatoryName)) ? context.SignatoryName : "" },    
                { "SignatoryRelation", (!string.IsNullOrEmpty(context.SignatoryRelation)) ? context.SignatoryRelation : "" },    
                { "AgreeToTerms", context.AgreeToTerms.ToString() },    
                { "TcpaPreference", context.TcpaPreference.ToString() },    
                { "PdfUrl", new Uri(Request.RequestUri, "/api/MobileEnrollment/w9/token/" + await mobileEnrollment.CreatePdfToken(result)).ToString() }/**/
            });

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
        [Route("w9/temp/{id}")]
        public async Task<HttpResponseMessage> DownloadW9(Guid id)
        {
            var pdfData = await mobileEnrollment.RetrievePdf(id);
            if (pdfData == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var stream = new MemoryStream(pdfData);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
            return result;
        }

        [HttpGet]
        [Route("w9/token/{*token}")]
        public async Task<HttpResponseMessage> DownloadW9(string token)
        {
            var pdfData = await mobileEnrollment.RetrievePdf(token);
            if (pdfData == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var stream = new MemoryStream(pdfData);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
            return result;
        }

        [HttpGet]
        [Route("importdata")]
        public void ImportData(string path)
        {
            TemplateItem folderTemplate = Sitecore.Context.Database.GetTemplate("Common/Folder");
            TemplateItem deviceTemplate = Sitecore.Context.Database.GetTemplate("User Defined/Taxonomy/Mobile Enrollment/BYO Device Model");
            Item BYODFolder = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Mobile BYO Devices");
            Item makeItem;
            Item modelItem;

            using (new Sitecore.SecurityModel.SecurityDisabler())
            {
                // Empty the BYODFolder
                foreach (Item child in BYODFolder.Children)
                {
                    child.Delete();
                }

                TextFieldParser parser = new TextFieldParser(path);
                parser.TextFieldType = Microsoft.VisualBasic.FileIO.FieldType.Delimited;
                parser.SetDelimiters(",");
            
                while (!parser.EndOfData)
                {
                    string[] fields = parser.ReadFields();
                    string pattern = @"[^\w\s\-\$]"; // only allow \w, \s, -, and $ for Sitecore Item names
                    Regex rgx = new Regex(pattern);

                    string phoneMake = fields[0];
                    string phoneModel = fields[1];
                    string phoneMakeItemName = rgx.Replace(phoneMake, "");
                    string phoneModelItemName = rgx.Replace(phoneModel, "");

                    makeItem = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Mobile BYO Devices/" + phoneMakeItemName);

                    if (makeItem == null)
                    {
                        // Create new folder from phone make
                        makeItem = BYODFolder.Add(phoneMakeItemName, folderTemplate);
                    }

                    // Create new item from phone model
                    modelItem = makeItem.Add(phoneModelItemName, deviceTemplate);

                    modelItem.Editing.BeginEdit();
                    modelItem.Fields["Model"].Value = phoneModel;
                    modelItem.Editing.EndEdit();

                }
                parser.Close();

            }

        }
    }
}
