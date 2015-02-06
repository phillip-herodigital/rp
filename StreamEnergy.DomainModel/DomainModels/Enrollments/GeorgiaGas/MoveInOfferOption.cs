using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    public class MoveInOfferOption : OfferOption
    {
        public const string Qualifier = "GeorgiaGasMoveIn";

        [Required]
        public DateTime? ConnectDate { get; set; }

        // Note - do not use this fee other than for display; it can be affected by the client
        public decimal ConnectionFee { get; set; }

        public override string OptionType
        {
            get { return MoveInOfferOption.Qualifier; }
        }

    }
}
