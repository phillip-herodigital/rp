using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class TexasElectricityOffer : IOffer
    {
        public string ID
        {
            get { throw new NotImplementedException(); }
        }

        public string OfferType
        {
            get { throw new NotImplementedException(); }
        }

        public IOfferOptionPolicy GetOfferOptionPolicy()
        {
            throw new NotImplementedException();
        }
    }
}
