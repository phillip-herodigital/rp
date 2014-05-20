using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    public class TokenizedCard : IPaymentInfo
    {
        [Required]
        public string CardToken { get; set; }

        // TODO - I have no idea what is needed here other than the token
    }
}
