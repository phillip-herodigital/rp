using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FaqSearchFilter
    {
        public FAQCategory Category { get; set; }
        public FaqSubcategory Subcategory { get; set; }
        public FAQState State { get; set; }
        public int StartRowIndex { get; set; }
        public int MaximumRows { get; set; }

    }
}