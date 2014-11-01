using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    [Serializable]
    public class CreateAccountInternalContext
    {
        public Account Account { get; set; }
    }
}
