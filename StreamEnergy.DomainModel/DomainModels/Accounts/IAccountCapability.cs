using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    /// <summary>
    /// Capabilities on accounts, since they might not be loaded, do not indicate anything simply by presence; the absence would simply mean
    /// they are not loaded. As such, account capabilities need to be either present or not, and not listed multiple times.
    /// </summary>
    public interface IAccountCapability
    {
        string CapabilityType { get; }
    }
}
