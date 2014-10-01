using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class CreateAccountInternalContext
    {
        public Guid GlobalCustomerId { get; set; }

        public Account Account { get; set; }
    }
}
