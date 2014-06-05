using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class CreateFailedState : SimpleFinalState<CreateAccountContext, CreateAccountInternalContext>
    {
    }
}
