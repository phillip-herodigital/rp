using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Activation
{
    public class LookupAccountByEsnRequest
    {
        [Required]
        public string ActivationCode { get; set; }

        [Required]
        public string LastName { get; set; }
    }
}
