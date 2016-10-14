using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments.Protective
{
    [Serializable]
    public class OfferOption : IOfferOption
    {
        public const string Qualifier = "Protective";
        
        public string OptionType
        {
            get { return Qualifier; }
        }

        public string PreviousProvider { get; set; }

        public void Sanitize()
        {
        }

        public DateTime ActivationDate { get; set; }
        public bool UseInstallmentPlan { get; set; }
       
    }
}
