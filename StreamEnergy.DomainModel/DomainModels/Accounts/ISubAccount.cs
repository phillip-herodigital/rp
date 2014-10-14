using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public interface ISubAccount: ISanitizable
    {
        string SubAccountType { get; }
        string Key { get;  }
        string Id { get; }

        Address ServiceAddress { get; }
    }
}
