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
        
        // TODO - update these phone variables to the new phone model with phone type
        [Required]
        public TypedPhone PrimaryPhone { get; set; }

        public TypedPhone SecondaryPhone { get; set; }
        public IEnumerable<PhoneCategory> PhoneTypes { get; set; }
        public Address ServiceAddress { get; set; }
        public bool SameAsService { get; set; }
        public Address BillingAddress { get; set; }
    }
}