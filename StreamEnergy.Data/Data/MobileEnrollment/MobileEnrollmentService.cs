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
        private static readonly StreamEnergy.Cryptography cryptography = new StreamEnergy.Cryptography("7s6xxnq69ptkojji", "ccqt0prq7xgv6gl5");
        private const string password = "rcd8qltwh6ujhxj8";

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
                    ShippingAddressSame = data.ShippingAddressSame,
                    BusinessAddress = data.BusinessAddress,
                    BusinessAddressSame = data.BusinessAddressSame,
                    BusinessInformationName = data.BusinessInformationName,
                    BusinessName = data.BusinessName,
                    TaxClassification = data.BusinessTaxClassification,
                    AdditionalTaxClassification = data.AdditionalTaxClassification,
                    ExemptCode = data.ExemptCode,
                    FatcaCode = data.FatcaCode,
                    CurrentAccountNumbers = data.CurrentAccountNumbers,
                    SocialSecurityNumber = data.SocialSecurityNumber,
                    TaxId = data.TaxId,
                    CustomerCertification = DateTimeOffset.Now,
                    CustomerSignature = data.CustomerSignature,
                    SignatureImage = data.SignatureImage,
                    SignatureConfirmation = data.SignatureConfirmation,
                    SignatoryName = data.SignatoryName,
                    SignatoryRelation = data.SignatoryRelation,
                    AgreeToTerms = DateTimeOffset.Now,
                    TcpaPreference = data.TcpaPreference,
                    PdfGen = w9Pdf,
                    Network = data.Network,
                    NewDeviceSku = data.NewDeviceSku,
                    BuyingOption = data.BuyingOption,
                    Price = data.Price,
                    Warranty = data.Warranty,
                    DeviceMake = data.DeviceMake,
                    DeviceModel = data.DeviceModel,
                    DeviceColor = data.DeviceColor,
                    DeviceSize = data.DeviceSize,
                    DeviceSerial = data.DeviceSerial,
                    SimNumber = data.SimNumber,
                    NewNumber = data.NewNumber,
                    PortInNumber = data.PortInNumber,
                    PreviousServiceProvider = data.PreviousServiceProvider,
                    PlanId = data.PlanId,
                    AssociateId = data.AssociateId,
                    SourceId = data.SourceId,
                    OrderId = null,
                };
            dataContext.EnrollmentRecords.Add(record);

            await dataContext.SaveChangesAsync();

            return record.Id;
        }

        async Task<byte[]> IMobileEnrollmentService.RetrievePdf(Guid mobileEnrollmentId)
        {
            var record = await dataContext.EnrollmentRecords.FindAsync(mobileEnrollmentId);
            
            if (record.AgreeToTerms.AddMinutes(20) > DateTimeOffset.Now)
            {
                return record.PdfGen;
            }
            // Don't allow downloading of the pdf after 20 minutes as a security precaution
            return null;
        }

        async Task<string> IMobileEnrollmentService.CreatePdfToken(Guid mobileEnrollmentId)
        {
            var record = await dataContext.EnrollmentRecords.FindAsync(mobileEnrollmentId);
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(cryptography.Encrypt(mobileEnrollmentId.ToString("N") + record.AgreeToTerms.ToString(), password)));            
        }

        async Task<byte[]> IMobileEnrollmentService.RetrievePdf(string token)
        {
            var decrypted = cryptography.Decrypt(System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(token)), password);
            if (decrypted == null)
                return null;

            var idPart = decrypted.Substring(0, 32);
            var agreeTimestampPart = decrypted.Substring(32);

            var mobileEnrollmentId = Guid.ParseExact(idPart, "N");
            var record = await dataContext.EnrollmentRecords.FindAsync(mobileEnrollmentId);

            if (record.AgreeToTerms.ToString() != agreeTimestampPart)
                return null;

            return record.PdfGen;
        }
    }
}
