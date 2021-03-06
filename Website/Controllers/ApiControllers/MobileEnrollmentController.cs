﻿using System;
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
using StreamEnergy.MyStream.Models.MobileEnrollment;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/MobileEnrollment")]
    public class MobileEnrollmentController : ApiController
    {
        private readonly IMobileEnrollmentService mobileEnrollment;
        private readonly IW9GenerationService w9Generator;
        private readonly IEmailService emailService;
        private readonly ISettings settings;
        private readonly StackExchange.Redis.IDatabase redisDatabase;

        public MobileEnrollmentController(IMobileEnrollmentService mobileEnrollment, IW9GenerationService w9Generator, IEmailService emailService, ISettings settings, StackExchange.Redis.IDatabase redisDatabase)
        {
            this.mobileEnrollment = mobileEnrollment;
            this.w9Generator = w9Generator;
            this.emailService = emailService;
            this.settings = settings;
            this.redisDatabase = redisDatabase;
        }

        [HttpPost]
        public async Task<IHttpActionResult> Submit(UserContext context)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var plain = System.Text.Encoding.ASCII.GetString(Convert.FromBase64String(context.AssociateId));
                var parts = plain.Split('|');
                context.AssociateId = parts[0];
            }
            catch
            {
                context.AssociateId = "A2";
            }

            var w9Pdf = w9Generator.GenerateW9(context.BusinessInformationName, context.BusinessName, context.BusinessTaxClassification, context.AdditionalTaxClassification, context.ExemptCode, context.FatcaCode, context.BusinessAddress, context.CurrentAccountNumbers, context.SocialSecurityNumber, context.TaxId, context.SignatureImage, DateTime.Now);
            var result = await mobileEnrollment.RecordEnrollment(context, w9Pdf);

            var emailTemplate = new Guid("{3F7959FA-8578-470D-963F-4AFE8FCAB66F}");

            await emailService.SendEmail(emailTemplate, settings.GetSettingsValue("Marketing Form Email Addresses", "Mobile Enrollment Email Address"), new System.Collections.Specialized.NameValueCollection ()
            {
                { "Network", context.Network ?? "" },
                { "NewDeviceSku", context.NewDeviceSku ?? "" },
                { "BuyingOption", context.BuyingOption ?? "" },
                { "Price", context.Price ?? "" },
                { "Warranty", context.Warranty ?? "" },
                { "DeviceMake", context.DeviceMake ?? "" },    
                { "DeviceColor", context.DeviceColor ?? "" },
                { "DeviceSize", context.DeviceSize ?? "" },
                { "DeviceModel", context.DeviceModel ?? "" },    
                { "DeviceSerial", context.DeviceSerial ?? "" },    
                { "SimNumber", context.SimNumber ?? "" },    
                { "NewNumber", context.NewNumber ?? "" },    
                { "PortInNumber", context.PortInNumber ?? "" },    
                { "PreviousServiceProvider", context.PreviousServiceProvider ?? "" },
                { "PlanId", context.PlanId }, 
                { "AssociateId", context.AssociateId ?? "" },
                { "Name", context.ContactInfo.Name.First + " " + context.ContactInfo.Name.Last },    
                { "Phone", context.ContactInfo.Phone.First().Number },    
                { "Email", context.ContactInfo.Email.Address },    
                { "BillingAddress", context.BillingAddress.ToSingleLine() },    
                { "ShippingAddress", context.ShippingAddress.ToSingleLine() },    
                { "ShippingAddressSame", context.ShippingAddressSame.ToString() },    
                { "BusinessAddress", context.BusinessAddress.ToSingleLine() },    
                { "BusinessAddressSame", context.BusinessAddressSame.ToString() },    
                { "BusinessInformationName", context.BusinessInformationName },    
                { "BusinessName", context.BusinessName ?? "" },    
                { "BusinessTaxClassification", context.BusinessTaxClassification.ToString() },    
                { "AdditionalTaxClassification", context.AdditionalTaxClassification ?? "" },    
                { "ExemptCode", context.ExemptCode ?? "" },    
                { "FatcaCode", context.FatcaCode ?? "" },    
                { "CurrentAccountNumbers", context.CurrentAccountNumbers ?? "" },
                { "SocialSecurityNumber", context.SocialSecurityNumber ?? "" },
                { "TaxId", context.TaxId ?? "" },
                { "CustomerCertification", context.CustomerCertification.ToString() },    
                { "CustomerSignature", context.CustomerSignature },    
                { "SignatureConfirmation", context.SignatureConfirmation.ToString() },    
                { "SignatoryName", context.SignatoryName ?? "" },    
                { "SignatoryRelation", context.SignatoryRelation ?? "" },    
                { "AgreeToTerms", context.AgreeToTerms.ToString() },    
                { "TcpaPreference", context.TcpaPreference.ToString() },    
                { "PdfUrl", new Uri(Request.RequestUri, "/api/MobileEnrollment/w9/token/" + System.Uri.EscapeDataString(await mobileEnrollment.CreatePdfToken(result))).ToString() }/**/
            });

            if (result != Guid.Empty)
            {
                if (context.RestoreData != null && redisDatabase != null)
                {
                    await redisDatabase.ListRightPushAsync("EnrollmentScreenshots", context.RestoreData.Insert(1, "\"confirmationNumber\":\"" + result.ToString() + "\","));
                }
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
        [Route("verifyDeviceNumber/{deviceNumber}")]
        public VerifyDeviceNumberResponse VerifyDeviceNumber(string deviceNumber)
        {
            if (deviceNumber == "111") {
                return new VerifyDeviceNumberResponse
                {
                    IsEligible = true,
                    VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                    NetworkType = "GSM",
                    Manufacturer = "Samsung"
                };
            }
            if (deviceNumber == "222")
            {
                return new VerifyDeviceNumberResponse
                {
                    IsEligible = true,
                    VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                    NetworkType = "GSM",
                    Manufacturer = "Apple"
                };
            }
            if (deviceNumber == "333")
            {
                return new VerifyDeviceNumberResponse
                {
                    IsEligible = true,
                    VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                    NetworkType = "CDMA",
                    Manufacturer = "Samsung"
                };
            }
            if (deviceNumber == "444")
            {
                return new VerifyDeviceNumberResponse
                {
                    IsEligible = true,
                    VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                    NetworkType = "CDMA",
                    Manufacturer = "Apple"
                };
            }
            else
            {
                return new VerifyDeviceNumberResponse
                {
                    IsEligible = false,
                    VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.UnknownError,
                };
            }

        }

        [HttpGet]
        [Route("importdata")]
        public void ImportData(string path)
        {
            TemplateItem folderTemplate = Sitecore.Context.Database.GetTemplate("Common/Folder");
            TemplateItem deviceTemplate = Sitecore.Context.Database.GetTemplate("User Defined/Taxonomy/Mobile Enrollment/BYO Device Model");
            Item BYODFolder = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile BYO Devices");
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

                    makeItem = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile BYO Devices/" + phoneMakeItemName);

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

        [HttpGet]
        [Route("importcdmadata")]
        public void ImportCdmaData(string path)
        {
            TemplateItem folderTemplate = Sitecore.Context.Database.GetTemplate("Common/Folder");
            TemplateItem deviceTemplate = Sitecore.Context.Database.GetTemplate("User Defined/Taxonomy/Mobile Enrollment/BYO Device Model");
            Item BYODFolder = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile CDMA BYO Devices");
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
                    string phoneLte = fields[2];
                    string phoneMakeItemName = rgx.Replace(phoneMake, "");
                    string phoneModelItemName = rgx.Replace(phoneModel, "");

                    makeItem = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile CDMA BYO Devices/" + phoneMakeItemName);

                    if (makeItem == null)
                    {
                        // Create new folder from phone make
                        makeItem = BYODFolder.Add(phoneMakeItemName, folderTemplate);
                    }

                    // Create new item from phone model
                    modelItem = makeItem.Add(phoneModelItemName, deviceTemplate);

                    Sitecore.Data.Fields.CheckboxField checkbox = modelItem.Fields["LTE"];

                    modelItem.Editing.BeginEdit();
                    modelItem.Fields["Model"].Value = phoneModel;
                    checkbox.Checked = (phoneLte == "Y");
                    modelItem.Editing.EndEdit();

                }
                parser.Close();

            }

        }
        
        [HttpGet]
        [Route("importfaqdata")]        
        public void ImportFAQData(string path)
        {
            Item FAQFolder = Sitecore.Context.Database.GetItem("/sitecore/content/Home/services/mobile/faqs");
            TemplateItem FAQGroupTemplate = Sitecore.Context.Database.GetTemplate("User Defined/Components/Marketing/FAQ Group");
            TemplateItem FAQTemplate = Sitecore.Context.Database.GetTemplate("User Defined/Components/Marketing/FAQ");
            Item FAQGroupItem;
            Item FAQItem;

            using (new Sitecore.SecurityModel.SecurityDisabler())
            {
                foreach (Item child in FAQFolder.Children)
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
                    string faqGroup = fields[0];
                    string faqGroupItemName = rgx.Replace(faqGroup, "");

                    FAQGroupItem = Sitecore.Context.Database.GetItem("/sitecore/content/Home/services/mobile/faqs/" + faqGroupItemName);
                    if (FAQGroupItem == null)
                    {
                        FAQGroupItem = FAQFolder.Add(faqGroupItemName, FAQGroupTemplate);
                        FAQGroupItem.Editing.BeginEdit();
                        FAQGroupItem.Fields["Name"].Value = faqGroup;
                        FAQGroupItem.Editing.EndEdit();
                    }

                    int sortOrder = Convert.ToInt16(fields[1]);
                    string faqQuestion = fields[2];
                    string faqAnswer = fields[3];
                    string faqQuestionItemName = rgx.Replace(faqQuestion, "");

                    FAQItem = Sitecore.Context.Database.GetItem("/sitecore/content/home/services/mobile/faqs/" + faqGroupItemName + "/" + faqQuestionItemName);
                    if (FAQItem == null)
                    {
                        FAQItem = FAQGroupItem.Add(faqQuestionItemName, FAQTemplate);                        
                        FAQItem.Editing.BeginEdit();
                        FAQItem.Fields["FAQ Question"].Value = faqQuestion;
                        FAQItem.Fields["FAQ Answer"].Value = faqAnswer;
                        FAQItem.Appearance.Sortorder = sortOrder;
                        FAQItem.Editing.EndEdit();
                    }
                }
                parser.Close();
            }
        }
    }
}
