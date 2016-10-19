using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    public class MoveInOfferOption : OfferOption
    {
        public new const string Qualifier = "NewYorkGasMoveIn";

        [Required]
        public DateTime? ConnectDate { get; set; }

        [Required]
        public string ConnectTime { get; set; }

        public string LUAN { get; set; }

        // Note - do not use this fee other than for display; it can be affected by the client
        public decimal ConnectionFee { get; set; }

        public override string OptionType
        {
            get { return MoveInOfferOption.Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}
