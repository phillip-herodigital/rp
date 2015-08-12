using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy
{
    public interface ISitecoreAccessor
    {
        string GetFieldValue(string itemPath, string field, string defaultValue = null);
    }
}
