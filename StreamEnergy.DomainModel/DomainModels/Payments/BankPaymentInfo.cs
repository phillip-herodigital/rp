using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    public class BankPaymentInfo : IPaymentInfo
    {
        public const string Qualifier = "BankPaymentMethod";

        public string PaymentType
        {
            get { return Qualifier; }
        }

        // TODO - fill the ErrorMessage field
        [Required]
        public BankAccountCategory Category { get; set; }
        [Required]
        [RegularExpression("^[0-9]{9}$")]
        public string RoutingNumber { get; set; }
        [Required]
        [RegularExpression("^[0-9]+$")]
        public string AccountNumber { get; set; }
    }
}
