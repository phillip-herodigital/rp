using Sitecore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StreamEnergy.Unity;

namespace StreamEnergy.Mvc.Sitecore
{
    class SitecoreContainerSetup : IContainerSetupStrategy
    {
        public void SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.RegisterInstance<ISitecoreContext>(new SitecoreContext());
            unityContainer.RegisterType<ISettings, SitecoreSettings>();
        }
    }
}
