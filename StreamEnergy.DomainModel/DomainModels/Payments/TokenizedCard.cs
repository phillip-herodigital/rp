using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    [Serializable]
    public class TokenizedCard : IPaymentInfo
    {
        public const string Qualifier = "TokenizedCard";

        public string PaymentType { get { return Qualifier; } }

        // TODO - fill the ErrorMessage field
        [Required]
        public string CardToken { get; set; }

        public DateTime ExpirationDate { get; set; }
        [Required]
        public string BillingZipCode { get; set; }
        [Required]
        public string SecurityCode { get; set; }
    }
}
