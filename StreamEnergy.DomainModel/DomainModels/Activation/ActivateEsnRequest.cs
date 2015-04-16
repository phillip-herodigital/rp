using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Activation
{
    public class ActivateEsnRequest
    {
        [Required]
        public string AccountNumber { get; set; }

        [Required]
        public string ActivationCode { get; set; }
    }
}
