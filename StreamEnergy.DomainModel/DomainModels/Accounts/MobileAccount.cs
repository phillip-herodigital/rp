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
    public class MobileAccount : ISubAccount
    {
        public const string Qualifier = "Mobile";
        
        public const string Classification = "Mobile";

        public string Id { get; set; }

        public Address ServiceAddress
        {
            get 
            {
                throw new NotImplementedException();
            }
        }

        public bool RenewalEligibility
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
            get { return MobileAccount.Qualifier; }
        }

        public string Key
        {
            get { return MobileAccount.Classification; }
        }

        public string PhoneNumber { get; set; }
        public string SerialNumber { get; set; }
        public string EquipmentId { get; set; }
        public string PlanId { get; set; }
        public double PlanPrice { get; set; }
        public double PlanDataAvailable { get; set; }
        public string PlanName { get; set; }
        public string ParentGroupProductId { get; set; }
        public bool IsParentGroup { get; set; }
        public string Carrier { get; set; }
        public DateTime ActivationDate { get; set; }
        public DateTime LastBillDate { get; set; }
        public DateTime NextBillDate { get; set; }

        public Enrollments.EnrollmentCustomerType CustomerType { get; set; }
        public string ProductType { get { return "Mobile"; } }
    }
}
