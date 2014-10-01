using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public interface ICurrentUser
    {

        Guid StreamConnectCustomerId { get; }
        IEnumerable<Account> Accounts { get; set; }
    }
}
