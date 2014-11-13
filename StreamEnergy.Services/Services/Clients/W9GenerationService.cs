using Persits.PDF;
using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.MobileEnrollment;

namespace StreamEnergy.Services.Clients
{
    class W9GenerationService : IW9GenerationService
    {
        byte[] IW9GenerationService.GenerateW9(string name, string businessName, W9BusinessClassification businessType, string businessTypeAdditional, string exemptPayeeCode, string fatcaExemtionCode, Address address, string currentAccountNumbers, string socialSecurityNumber, string employerIdentificationNumber, byte[] signature, DateTime date)
        {
            var objPDF = new PdfManager();
            var path = Sitecore.IO.FileUtil.MapPath(Sitecore.IO.FileUtil.MakePath(Sitecore.Configuration.Settings.DataFolder, "fw9.pdf"));
            var objDoc = objPDF.OpenDocument(path);

            // Obtain page 1 of the document
            PdfPage objPage = objDoc.Pages[1];

            // Create empty param object to be used throughout the app
            PdfParam objParam = objPDF.CreateParam(null);

            PdfFont objFont = objDoc.Fonts["Helvetica-Bold"]; // a standard font

            ((dynamic)objPage.Annots[1]).FieldValue = name;
            ((dynamic)objPage.Annots[2]).FieldValue = businessName ?? "";

            var textFields = new
            {
                llcTaxClassification = ((dynamic)objPage.Annots[9]),
                otherBusinessType = ((dynamic)objPage.Annots[11]),
                exemptPayeeCode = ((dynamic)objPage.Annots[12]),
                exemptFatcaExemtionCode = ((dynamic)objPage.Annots[13]),
                address = ((dynamic)objPage.Annots[14]),
                cityStateZip = ((dynamic)objPage.Annots[15]),
                requesterNameAddress = ((dynamic)objPage.Annots[16]),
                listAccountNumbers = ((dynamic)objPage.Annots[17]),
                ssn1 = ((dynamic)objPage.Annots[18]),
                ssn2 = ((dynamic)objPage.Annots[19]),
                ssn3 = ((dynamic)objPage.Annots[20]),
                employerIdentificationNumber1 = ((dynamic)objPage.Annots[21]),
                employerIdentificationNumber2 = ((dynamic)objPage.Annots[22]),
            };

            switch(businessType)
            {
                case W9BusinessClassification.IndividualSoleProprietor:
                    ((dynamic)objPage.Annots[3]).FieldActiveState = "On";
                    break;
                case W9BusinessClassification.CCorporation:
                    ((dynamic)objPage.Annots[4]).FieldActiveState = "On";
                    break;
                case W9BusinessClassification.SCorporation:
                    ((dynamic)objPage.Annots[5]).FieldActiveState = "On";
                    break;
                case W9BusinessClassification.Partnership:
                    ((dynamic)objPage.Annots[6]).FieldActiveState = "On";
                    break;
                case W9BusinessClassification.TrustEstate:
                    ((dynamic)objPage.Annots[7]).FieldActiveState = "On";
                    break;
                case W9BusinessClassification.LLC:
                    ((dynamic)objPage.Annots[8]).FieldActiveState = "On";
                    break;
                case W9BusinessClassification.Other:
                    ((dynamic)objPage.Annots[10]).FieldActiveState = "On";
                    break;
            }

            if (businessType == W9BusinessClassification.LLC && !string.IsNullOrEmpty(businessTypeAdditional))
            {
                textFields.llcTaxClassification.FieldValue = businessTypeAdditional;
            }
            if (businessType == W9BusinessClassification.Other && !string.IsNullOrEmpty(businessTypeAdditional))
            {
                textFields.otherBusinessType.FieldValue = businessTypeAdditional;
            }
            textFields.exemptPayeeCode.FieldValue = exemptPayeeCode ?? "";
            textFields.exemptFatcaExemtionCode.FieldValue = fatcaExemtionCode ?? "";

            textFields.address.FieldValue = address.Line1 + (string.IsNullOrEmpty(address.Line2) ? "" : ", " + address.Line2);
            textFields.cityStateZip.FieldValue = string.Format("{0}, {1} {2}", address.City, address.StateAbbreviation, address.PostalCode5);
            textFields.listAccountNumbers.FieldValue = currentAccountNumbers ?? "";

            if (!string.IsNullOrEmpty(socialSecurityNumber))
            {
                textFields.ssn1.FieldValue = socialSecurityNumber.Substring(0, 3);
                textFields.ssn2.FieldValue = socialSecurityNumber.Substring(3, 2);
                textFields.ssn3.FieldValue = socialSecurityNumber.Substring(5);
            }

            if (!string.IsNullOrEmpty(employerIdentificationNumber))
            {
                textFields.employerIdentificationNumber1.FieldValue = employerIdentificationNumber.Substring(0, 2);
                textFields.employerIdentificationNumber2.FieldValue = employerIdentificationNumber.Substring(2);
            }

            // Date
            objPage.Canvas.DrawText(date.ToString("MMM d, yyyy"), "x=412, y=265", objFont);

            // Signature - taken from a .gif file (image itself) and .bmp (mask)
            PdfImage objSignatureImg = objDoc.OpenImage(signature);

            objPage.Canvas.DrawImage(objSignatureImg, "x=164; y=252; scalex=.25, scaley=.25");

            byte[] pdf = objDoc.SaveToMemory();
            
            return pdf;
        }
    }
}
