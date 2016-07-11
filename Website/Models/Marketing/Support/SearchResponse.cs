using System.Collections.Generic;

namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class SearchResponse
    {
        public IEnumerable<FAQ> FAQs { get; set; }
        public int FAQCount { get; set; }
        public IEnumerable<string> Keywords { get; set; }
    }
}