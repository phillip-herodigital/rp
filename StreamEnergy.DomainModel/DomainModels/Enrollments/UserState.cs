using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class UserState : ISanitizable
    {
        public CustomerContact ContactInfo { get; set; }
        public Address ServiceAddress { get; set; }
        public CustomerContact SecondaryContactInfo { get; set; }

        public string SocialSecurityNumber { get; set; }
        // DL # & State 
        public DriversLicense DriversLicense { get; set; }
        public string Language { get; set; }

        public Address BillingAddress { get; set; }
        public string SelectedPlan { get; set; }

        /*         
         IA Name / Number 
         Current Energy Provider
        */

        void ISanitizable.Sanitize()
        {
        }
    }
}
