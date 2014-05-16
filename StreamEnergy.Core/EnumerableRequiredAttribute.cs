using System;
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
                return ((System.Collections.IEnumerable)value).Cast<object>().All(entry => entry != null);
            }
            return true;
        }
    }
}
