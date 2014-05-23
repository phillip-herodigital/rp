using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    public class EnumerableRequiredAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value != null)
            {
                if (value is IDictionary)
                    return ((IDictionary)value).Values.Cast<object>().All(entry => entry != null);
                return ((IEnumerable)value).Cast<object>().All(entry => entry != null);
            }
            return true;
        }
    }
}
