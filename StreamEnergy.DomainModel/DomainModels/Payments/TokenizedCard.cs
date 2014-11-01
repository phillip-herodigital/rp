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

        [Required]
        public string CardToken { get; set; }

        [Required]
        public string Name { get; set; }

        public DateTime ExpirationDate { get; set; }
        [Required]
        [RegularExpression("^[0-9]{5}$")]
        public string BillingZipCode { get; set; }
        [Required]
        [RegularExpression("^[0-9]{3}$")]
        public string SecurityCode { get; set; }
    }
}
