using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class GeorgiaElectricityAccount : ISubAccount
    {
        public const string Qualifier = "GeorgiaElectricity";
        
        public const string Classification = "Utility";

        public string Id { get; set; }

        [Required(ErrorMessage = "Service Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Service Address ")]
        public Address ServiceAddress { get; set; }

        void ISanitizable.Sanitize()
        {
            if (ServiceAddress != null)
                ((ISanitizable)ServiceAddress).Sanitize();
        }

        public string SubAccountType
        {
            get { return GeorgiaElectricityAccount.Qualifier; }
        }

        public string Key
        {
            get { return GeorgiaElectricityAccount.Classification; }
        }

    }
}
