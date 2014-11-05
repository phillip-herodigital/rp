using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.MobileEnrollment;

namespace StreamEnergy.Data.MobileEnrollment
{
    class MobileEnrollmentService : IMobileEnrollmentService
    {
        private readonly DataContext dataContext;

        public MobileEnrollmentService(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }


        async Task<Guid> IMobileEnrollmentService.RecordEnrollment(UserContext data, byte[] w9Pdf)
        {
            var record = new EnrollmentRecord
                {
                    Name = data.ContactInfo.Name,
                    Phone = (TypedPhone)data.ContactInfo.Phone.First(),
                    Email = data.ContactInfo.Email,
                    BillingAddress = data.BillingAddress,
                    ShippingAddress = data.ShippingAddress,
                    BusinessAddress = data.BusinessAddress,
                    BusinessInformationName = data.BusinessInformationName,
                    BusinessName = data.BusinessName,
                    TaxClassification = data.BusinessTaxClassification,
                    AdditionalTaxClassification = data.AdditionalTaxClassification,
                    ExemptCode = data.ExemptCode,
                    FatcaCode = data.FATCACode,
                    BusinessAddressSame = data.BusinessAddressSame,
                    CurrentAccountNumbers = data.CurrentAccountNumbers,
                    CustomerCertification = DateTimeOffset.Now,
                    CustomerSignature = data.CustomerSignature,
                    SignatureConfirmation = data.SignatureConfirmation,
                    SignatoryName = data.SignatoryName,
                    SignatoryRelation = data.SignatoryRelation,
                    AgreeToTerms = DateTimeOffset.Now,
                    TcpaPreference = data.TcpaPreference,
                    PdfGen = w9Pdf,
                    AssociateId = null,
                    SourceId = null,
                    OrderId = null,
                };
            dataContext.EnrollmentRecords.Add(record);

            await dataContext.SaveChangesAsync();

            return record.Id;
        }

        async Task<byte[]> IMobileEnrollmentService.RetrievePdf(Guid mobileEnrollmentId)
        {
            var record = await dataContext.EnrollmentRecords.FindAsync(mobileEnrollmentId);
            
            return record.PdfGen;
        }

    }
}
