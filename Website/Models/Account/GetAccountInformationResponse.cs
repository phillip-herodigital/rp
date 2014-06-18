using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetAccountInformationResponse
    {
        public DomainModels.Name CustomerName { get; set; }
        
        // TODO - update these phone variables to the new phone model with phone type
        [Required]
        public DomainModels.Phone PrimaryPhone { get; set; }

        public DomainModels.Phone SecondaryPhone { get; set; }

        public DomainModels.Address ServiceAddress { get; set; }
        public bool SameAsService { get; set; }
        public DomainModels.Address BillingAddress { get; set; }
    }
}