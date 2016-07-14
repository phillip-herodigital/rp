using StreamEnergy.MyStream.Models.Marketing.Support;
using System.Collections.Generic;

namespace StreamEnergy.MyStream.Controllers
{
    public class SearchResult
    {
        public IEnumerable<FAQ> FAQs { get; set; }
        public int Length { get; set; }
    }
}