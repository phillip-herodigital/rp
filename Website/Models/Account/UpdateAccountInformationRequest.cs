using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateAccountInformationRequest
    {
        public string AccountId { get; set; }

        [Required]
        public DomainModels.Phone PrimaryPhone { get; set; }

        public DomainModels.Phone SecondaryPhone { get; set; }
        public DomainModels.Address BillingAddress { get; set; }
    }
}