using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Service
{
    [Serializable]
    public class PlaceMobileOrderResult : PlaceOrderResult
    {
        public string PhoneNumber { get; set; }
    }
}
