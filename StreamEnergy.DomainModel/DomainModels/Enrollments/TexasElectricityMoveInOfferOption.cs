using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class TexasElectricityMoveInOfferOption : TexasElectricityOfferOption
    {
        public new const string Qualifier = "TexasElectricityMoveIn";
        
        public DateTime ConnectDate { get; set; }

        // Note - do not use this fee other than for display; it can be affected by the client
        public decimal ConnectionFee { get; set; }

        public override string OptionType
        {
            get { return TexasElectricityMoveInOfferOption.Qualifier; }
        }

    }
}
