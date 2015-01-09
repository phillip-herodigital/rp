using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IRenewalCapability : IServiceCapability
    {
        DomainModels.Accounts.Account Account { get; }
        DomainModels.Accounts.ISubAccount SubAccount { get; }
    }
}
