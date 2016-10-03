using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class ProtectiveAccount : ISubAccount
    {
        public const string Qualifier = "Protective";
        
        public const string Classification = "Protective";

        public ProtectiveAccount()
        {
            Capabilities = new List<ISubAccountCapability>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public IList<ISubAccountCapability> Capabilities { get; private set; }

        public Address ServiceAddress
        {
            get 
            {
                throw new NotImplementedException();
            }
        }

        void ISanitizable.Sanitize()
        {
            if (ServiceAddress != null)
                ((ISanitizable)ServiceAddress).Sanitize();
        }

        public string SubAccountType
        {
            get { return ProtectiveAccount.Qualifier; }
        }

        public string Key
        {
            get { return ProtectiveAccount.Classification; }
        }

        public DateTime ActivationDate { get; set; }
        public DateTime LastBillDate { get; set; }
        public DateTime NextBillDate { get; set; }

        public Enrollments.EnrollmentCustomerType CustomerType { get; set; }
        public string ProductType { get { return "Protective"; } }
    }
}
