using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class AccountInformationState : StateBase<CreateAccountContext, CreateAccountInternalContext>
    {
        public AccountInformationState()
            : base(typeof(FindAccountState), typeof(CreateAccountState))
        {
        }
    }
}
