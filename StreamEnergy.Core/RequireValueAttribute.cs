using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    /// <summary>
    /// Requires that the value of the property matches the value provided. The value provided must be an equatable value.
    /// </summary>
    public class RequireValueAttribute : ValidationAttribute
    {
        public RequireValueAttribute(object value)
        {
            this.Value = value;
        }

        public object Value { get; private set; }

        public override bool IsValid(object value)
        {
            if (Value == null && value == null)
                return true;
            return Value.Equals(value);
        }
    }
}
