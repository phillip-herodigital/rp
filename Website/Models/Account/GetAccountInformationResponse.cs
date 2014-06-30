using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetAccountInformationResponse
    {
        public DomainModels.Name CustomerName { get; set; }

        [Required]
        public TypedPhone PrimaryPhone { get; set; }

        public TypedPhone SecondaryPhone { get; set; }
        public Address ServiceAddress { get; set; }
        public bool SameAsService { get; set; }
        public Address BillingAddress { get; set; }
    }
}