using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class GeorgiaGasAccount : ISubAccount
    {
        public const string Qualifier = "GeorgiaGas";
        
        public const string Classification = "Utility";

        public string Id { get; set; }

        [Required(ErrorMessage = "Service Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Service Address ")]
        public Address ServiceAddress { get; set; }

        void ISanitizable.Sanitize()
        {
            if (ServiceAddress != null)
                ((ISanitizable)ServiceAddress).Sanitize();
        }

        public string SubAccountType
        {
            get { return GeorgiaGasAccount.Qualifier; }
        }

        public string Key
        {
            get { return GeorgiaGasAccount.Classification; }
        }

        public string ProviderId { get; set; }
        public RateType RateType { get; set; }
        public decimal Rate { get; set; }
        public int TermMonths { get; set; }
        public string ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }

        public string EarlyTerminationFee { get; set; }
    }
}
