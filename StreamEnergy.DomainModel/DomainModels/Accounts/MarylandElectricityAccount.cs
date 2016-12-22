using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class MarylandElectricityAccount : ISubAccount
    {
        public const string Qualifier = "MarylandElectricity";

        public const string Classification = "Utility";

        public MarylandElectricityAccount()
        {
            Capabilities = new List<ISubAccountCapability>();
        }

        public string Id { get; set; }
        public IList<ISubAccountCapability> Capabilities { get; private set; }

        [Required(ErrorMessage = "Service Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Service Address ")]
        public Address ServiceAddress { get; set; }
        public Enrollments.EnrollmentCustomerType CustomerType { get; set; }
        public string ProductType { get { return "Electricity"; } }
        public string ProviderId { get; set; }

        public RateType RateType { get; set; }
        public decimal Rate { get; set; }
        public int TermMonths { get; set; }
        public string ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }

        public string EarlyTerminationFee { get; set; }
        public bool IncludesThermostat { get; set; }
        public bool IncludesSkydrop { get; set; }
        void ISanitizable.Sanitize()
        {
            if (ServiceAddress != null)
                ((ISanitizable)ServiceAddress).Sanitize();
        }

        public string SubAccountType
        {
            get { return MarylandElectricityAccount.Qualifier; }
        }

        public string Key
        {
            get { return MarylandElectricityAccount.Classification; }
        }

    }
}
