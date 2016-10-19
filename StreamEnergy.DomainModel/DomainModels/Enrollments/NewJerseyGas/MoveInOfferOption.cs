using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewJerseyGas
{
    [Serializable]
    public class MoveInOfferOption : OfferOption
    {
        public new const string Qualifier = "NewJerseyGasMoveIn";

        [Required]
        public DateTime? ConnectDate { get; set; }

        [Required]
        public string ConnectTime { get; set; }

        public string PreviousAccountNumber { get; set; }

        // Note - do not use this fee other than for display; it can be affected by the client
        public decimal ConnectionFee { get; set; }

        public override string OptionType
        {
            get { return MoveInOfferOption.Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}
