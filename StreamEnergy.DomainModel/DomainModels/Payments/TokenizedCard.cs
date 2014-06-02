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

        [Required]
        public string CardToken { get; set; }

        public string PaymentType { get { return Qualifier; } }

        // TODO - I have no idea what is needed here other than the token
    }
}
