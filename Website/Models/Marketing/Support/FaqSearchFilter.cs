using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FaqSearchFilter
    {
        public FAQCategory Category;
        public FaqSubcategory Subcategory;
        public FAQState State;

        public FaqSearchFilter() {
        }

        public FaqSearchFilter(FAQCategory Category, FaqSubcategory Subcategory, FAQState State) {
            this.Category = Category;
            this.Subcategory = Subcategory;
            this.State = State;
        }
    }
}