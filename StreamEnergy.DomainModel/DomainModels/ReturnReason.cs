using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    public class ReturnReason
    {
        [Required(ErrorMessage = "Return Reason Required")]
        public ReturnReason? string { get; set; }
    }
}
