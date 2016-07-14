using StreamEnergy.MyStream.Models.Marketing.Support;
using System.Collections.Generic;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class InitResponse
    {
        public IEnumerable<FAQCategory> Categories { get; set; }
        public IEnumerable<FaqSubcategory> Subcategories { get; set; }
        public IEnumerable<FAQ> FAQs { get; set; }
    }
}