using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Associate
{
    [Serializable]
    public class AssociateInformation
    {
        public string WebAlias { get; set; }
        public string AssociateName { get; set; }
        public string AssociateLevel { get; set; }
        public string AssociateId { get; set; }
        public byte[] AssociateImage { get; set; }
    }
}
