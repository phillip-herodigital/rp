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

            PdfFont objFont = objDoc.Fonts["Helvetica-Bold"]; // a standard font

            var textFields = new
            {
                name = ((dynamic)objPage.Annots[1]),
                businessName = ((dynamic)objPage.Annots[2]),
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

            setFieldValue(objPage, textFields.name, name, objFont);
            setFieldValue(objPage, textFields.businessName, businessName, objFont);

            switch(businessType)
            {
                case W9BusinessClassification.IndividualSoleProprietor:
                    checkBox(objPage, (dynamic)objPage.Annots[3], objFont);
                    break;
                case W9BusinessClassification.CCorporation:
                    checkBox(objPage, (dynamic)objPage.Annots[4], objFont);
                    break;
                case W9BusinessClassification.SCorporation:
                    checkBox(objPage, (dynamic)objPage.Annots[5], objFont);
                    break;
                case W9BusinessClassification.Partnership:
                    checkBox(objPage, (dynamic)objPage.Annots[6], objFont);
                    break;
                case W9BusinessClassification.TrustEstate:
                    checkBox(objPage, (dynamic)objPage.Annots[7], objFont);
                    break;
                case W9BusinessClassification.LLC:
                    checkBox(objPage, (dynamic)objPage.Annots[8], objFont);
                    break;
                case W9BusinessClassification.Other:
                    checkBox(objPage, (dynamic)objPage.Annots[10], objFont);
                    break;
            }

            if (businessType == W9BusinessClassification.LLC && !string.IsNullOrEmpty(businessTypeAdditional))
            {
                setFieldValue(objPage, textFields.llcTaxClassification, businessTypeAdditional, objFont);
            }
            if (businessType == W9BusinessClassification.Other && !string.IsNullOrEmpty(businessTypeAdditional))
            {
                setFieldValue(objPage, textFields.otherBusinessType, businessTypeAdditional, objFont);
            }
            setFieldValue(objPage, textFields.exemptPayeeCode, exemptPayeeCode, objFont);
            setFieldValue(objPage, textFields.exemptFatcaExemtionCode, fatcaExemtionCode, objFont);

            setFieldValue(objPage, textFields.address, address.Line1 + (string.IsNullOrEmpty(address.Line2) ? "" : ", " + address.Line2), objFont);
            setFieldValue(objPage, textFields.cityStateZip, string.Format("{0}, {1} {2}", address.City, address.StateAbbreviation, address.PostalCode5), objFont);
            setFieldValue(objPage, textFields.listAccountNumbers, currentAccountNumbers, objFont);

            if (!string.IsNullOrEmpty(socialSecurityNumber))
            {
                socialSecurityNumber = System.Text.RegularExpressions.Regex.Replace(socialSecurityNumber, "[^\\d]", "");

                setTinFieldValue(objPage, textFields.ssn1, socialSecurityNumber.Substring(0, 3), objFont);
                setTinFieldValue(objPage, textFields.ssn2, socialSecurityNumber.Substring(3, 2), objFont);
                setTinFieldValue(objPage, textFields.ssn3, socialSecurityNumber.Substring(5), objFont);
            }

            if (!string.IsNullOrEmpty(employerIdentificationNumber))
            {
                employerIdentificationNumber = System.Text.RegularExpressions.Regex.Replace(employerIdentificationNumber, "[^\\d]", "");

                setTinFieldValue(objPage, textFields.employerIdentificationNumber1, employerIdentificationNumber.Substring(0, 2), objFont);
                setTinFieldValue(objPage, textFields.employerIdentificationNumber2, employerIdentificationNumber.Substring(2), objFont);
            }

            setFieldValue(objPage, null, date.ToString("MMM d, yyyy"), objFont, 412, 265);

            // Signature - taken from a .gif file (image itself) and .bmp (mask)
            PdfImage objSignatureImg = objDoc.OpenImage(signature);

            objPage.Canvas.DrawImage(objSignatureImg, "x=164; y=252; scalex=.25, scaley=.25");
            objDoc.Form.Flatten();

            byte[] pdf = objDoc.SaveToMemory();
            
            return pdf;
        }

        private void setTinFieldValue(PdfPage page, dynamic field, string text, PdfFont font)
        {
            if (!string.IsNullOrEmpty(text))
            {
                float left = 4;
                foreach (var letter in text)
                {
                    setFieldValue(page, field, letter.ToString(), font, left, -5);
                    left += 14.5f;
                }
            }
        }
        private void setFieldValue(PdfPage page, dynamic field, string text, PdfFont font, float shiftLeft = 5, float shiftDown = 0)
        {
            if (!string.IsNullOrEmpty(text))
            {
                page.Canvas.DrawText(text, string.Format("x={0}, y={1}", (field != null ? field.Rect.Left : 0) + shiftLeft, (field != null ? field.Rect.Top : 0) + shiftDown), font);
            }
        }
        private void checkBox(PdfPage page, dynamic field, PdfFont font)
        {
            setFieldValue(page, field, "X", font, 1, 2);
        }
    }
}
