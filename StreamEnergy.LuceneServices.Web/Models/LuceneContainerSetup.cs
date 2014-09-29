using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace StreamEnergy.LuceneServices.Web.Models
{
    public class LuceneContainerSetup : IContainerSetupStrategy
    {
        void IContainerSetupStrategy.SetupUnity(IUnityContainer unityContainer)
        {
            string typeaheadStore = null;
            try
            {
                typeaheadStore = RoleEnvironment.GetLocalResource("TypeaheadStore").RootPath;
            }
            catch { }
            if (typeaheadStore == null)
            {
                typeaheadStore = HostingEnvironment.MapPath("~/Data/typeahead");
            }
            unityContainer.RegisterType<IndexSearcher>(new ContainerControlledLifetimeManager(), new InjectionFactory(container => new IndexSearcher(typeaheadStore)));
        }
    }
}