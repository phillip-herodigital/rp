﻿using Persits.PDF;
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

namespace StreamEnergy.Services.Clients
{
    class PdfGenerationService : IPdfGenerationService
    {
        byte[] IPdfGenerationService.GenerateW9(string name, string businessName, PdfBusinessClassification businessType, string businessTypeAdditional, bool isExempt, string address, string city, string state, string zip, string socialSecurityNumber, string employerIdentificationNumber, string signature, DateTime date)
        {
            var objPDF = new PdfManager();
            var objDoc = objPDF.OpenDocument("C:/pdfs/fw9.pdf");

            // Obtain page 1 of the document
            PdfPage objPage = objDoc.Pages[1];

            // Create empty param object to be used throughout the app
            PdfParam objParam = objPDF.CreateParam(null);

            PdfFont objFont = objDoc.Fonts["Helvetica-Bold"]; // a standard font

            ((dynamic)objPage.Annots[1]).FieldValue = name;
            ((dynamic)objPage.Annots[2]).FieldValue = businessName;

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
                case PdfBusinessClassification.IndividualSoleProprietor:
                    ((dynamic)objPage.Annots[3]).FieldActiveState = "On";
                    break;
                case PdfBusinessClassification.CCorporation:
                    ((dynamic)objPage.Annots[4]).FieldActiveState = "On";
                    break;
                case PdfBusinessClassification.SCorporation:
                    ((dynamic)objPage.Annots[5]).FieldActiveState = "On";
                    break;
                case PdfBusinessClassification.Partnership:
                    ((dynamic)objPage.Annots[6]).FieldActiveState = "On";
                    break;
                case PdfBusinessClassification.TrustEstate:
                    ((dynamic)objPage.Annots[7]).FieldActiveState = "On";
                    break;
                case PdfBusinessClassification.LLC:
                    ((dynamic)objPage.Annots[8]).FieldActiveState = "On";
                    break;
                case PdfBusinessClassification.Other:
                    ((dynamic)objPage.Annots[10]).FieldActiveState = "On";
                    break;
            }

            if (businessType == PdfBusinessClassification.LLC && !string.IsNullOrEmpty(businessTypeAdditional))
            {
                textFields.llcTaxClassification.FieldValue = businessTypeAdditional;
            }
            if (businessType == PdfBusinessClassification.Other && !string.IsNullOrEmpty(businessTypeAdditional))
            {
                textFields.otherBusinessType.FieldValue = businessTypeAdditional;
            }

            textFields.address.FieldValue = address;
            textFields.cityStateZip.FieldValue = string.Format("{0}, {1} {2}", city, state, zip);

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
            PdfImage objSignatureImg = objDoc.OpenImage(Convert.FromBase64String(signature));

            objPage.Canvas.DrawImage(objSignatureImg, "x=164; y=248; scalex=.15, scaley=.15");
            /*var img = objPage.ToImage();
            IPdfImage page1Img = objDoc.OpenImageBinary(img.SaveToMemory());
            objPage.Canvas.DrawImage(page1Img, "x=0; y=0; scalex=1, scaley=1");*/
            byte[] pdf = objDoc.SaveToMemory();
            //File.WriteAllBytes("C:/pdfs/saved" + DateTime.Now.Ticks.ToString() + ".pdf", pdf);
            
            return pdf;
        }
    }
}