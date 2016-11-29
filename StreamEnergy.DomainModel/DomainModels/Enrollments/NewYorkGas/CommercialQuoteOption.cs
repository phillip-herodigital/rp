using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    public class CommercialQuoteOption : OfferOption
    {
        public new const string Qualifier = "NewYorkGasCommercialQuote";

        public DateTime ConnectDate { get; set; }

        // Note - do not use this fee other than for display; it can be affected by the client
        public decimal ConnectionFee { get; set; }

        public override string PreviousProvider
        {
            get
            {
                return PreviousProvider;
            }

            set
            {
                throw new NotImplementedException();
            }
        }
        
        public override string OptionType
        {
            get
            {
                return Qualifier;
            }
        }
    }
}
