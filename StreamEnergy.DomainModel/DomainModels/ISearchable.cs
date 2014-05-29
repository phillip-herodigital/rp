using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    public interface ISearchable
    {
        string GetUniqueField();
    }
}
