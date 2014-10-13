using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    public class TokenizedBank : IPaymentInfo
    {
        public const string Qualifier = "TokenizedBank";

        public string PaymentType
        {
            get { return Qualifier; }
        }

        [Required]
        public BankAccountCategory Category { get; set; }
        [Required]
        [RegularExpression("^[0-9]{9}$")]
        public string RoutingNumber { get; set; }
        [Required]
        public string AccountToken { get; set; }
    }
}
