using ASPPDFLib;
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
        byte[] IPdfGenerationService.GenerateW9(string name, string businessName, PdfBusinessTypes businessType, string businessTypeAdditional, bool isExempt, string address, string city, string state, string zip, string socialSecurityNumber, string employerIdentificationNumber, byte[] signature, DateTime date)
        {
            var objPDF = new PdfManager();
            objPDF.RegKey = "IWezpalWK7pmJwdV21Ccrs1n1G0y1yap+CsGNqvV4IJrWt+0593iKMx0qkSWkS069jolVHhic9oF";
            var objDoc = objPDF.OpenDocument("C:/pdfs/fw9.pdf");

            // Obtain page 1 of the document
            IPdfPage objPage = objDoc.Pages[1];

            // Create empty param object to be used throughout the app
            IPdfParam objParam = objPDF.CreateParam(Missing.Value);

            IPdfFont objFont = objDoc.Fonts["Helvetica-Bold", Missing.Value]; // a standard font

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
                case PdfBusinessTypes.IndividualSoleProprietor:
                    ((dynamic)objPage.Annots[3]).FieldActiveState = "On";
                    break;
                case PdfBusinessTypes.CCorporation:
                    ((dynamic)objPage.Annots[4]).FieldActiveState = "On";
                    break;
                case PdfBusinessTypes.SCorporation:
                    ((dynamic)objPage.Annots[5]).FieldActiveState = "On";
                    break;
                case PdfBusinessTypes.Partnership:
                    ((dynamic)objPage.Annots[6]).FieldActiveState = "On";
                    break;
                case PdfBusinessTypes.TrustEstate:
                    ((dynamic)objPage.Annots[7]).FieldActiveState = "On";
                    break;
                case PdfBusinessTypes.LLC:
                    ((dynamic)objPage.Annots[8]).FieldActiveState = "On";
                    break;
                case PdfBusinessTypes.Other:
                    ((dynamic)objPage.Annots[10]).FieldActiveState = "On";
                    break;
            }

            if (businessType == PdfBusinessTypes.LLC && !string.IsNullOrEmpty(businessTypeAdditional))
            {
                textFields.llcTaxClassification.FieldValue = businessTypeAdditional;
            }
            if (businessType == PdfBusinessTypes.Other && !string.IsNullOrEmpty(businessTypeAdditional))
            {
                textFields.otherBusinessType.FieldValue = businessTypeAdditional;
            }

            textFields.address.FieldValue = address;
            textFields.cityStateZip.FieldValue = string.Format("{0}, {1} {2}", city, state, zip);

            textFields.ssn1.FieldValue = socialSecurityNumber.Substring(0, 3);
            textFields.ssn2.FieldValue = socialSecurityNumber.Substring(3, 2);
            textFields.ssn3.FieldValue = socialSecurityNumber.Substring(5);

            textFields.employerIdentificationNumber1.FieldValue = employerIdentificationNumber.Substring(0, 2);
            textFields.employerIdentificationNumber2.FieldValue = employerIdentificationNumber.Substring(2);

            // Date
            objPage.Canvas.DrawText(objPDF.FormatDate(date, "%b %d, %Y"), "x=432, y=337", objFont);
            
            //objDoc.Save("C:/pdfs/savedw9.pdf", true);
            byte[] pdf = objDoc.SaveToMemory();
            //File.WriteAllBytes("C:/pdfs/saved" + DateTime.Now.Ticks.ToString() + ".pdf", pdf);
            
            return pdf;
        }
    }
}
