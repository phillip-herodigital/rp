using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    public class MobileInventory
    {
        public string Id { get; set; }

        public string TypeId { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }
    }
}
