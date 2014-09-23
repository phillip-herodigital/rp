using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Accounts
{
    public class UserProfileLocator
    {
        private IUnityContainer container;

        public UserProfileLocator(IUnityContainer container)
        {
            this.container = container;
        }

        public virtual UserProfile Locate(string username)
        {
            return UserProfile.Locate(container, username);
        }
        
    }
}
