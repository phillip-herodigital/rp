using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    public class CollectionCountRangeAttribute : ValidationAttribute
    {
        public CollectionCountRangeAttribute(int minimum, int maximum)
        {
            this.Minimum = minimum;
            this.Maximum = maximum;
        }

        public override bool IsValid(object value)
        {
            if (value is ICollection)
            {
                return ((ICollection)value).Count < Minimum || ((ICollection)value).Count > Maximum;
            }
            return true;
        }

        public int Minimum { get; private set; }

        public int Maximum { get; private set; }
    }
}
