using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using Microsoft.Practices.Unity;
using StreamEnergy.Unity;

namespace StreamEnergy.LuceneServices.Web.Models
{
    public class LuceneContainerSetup : IContainerSetupStrategy
    {
        void IContainerSetupStrategy.SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.RegisterType<IndexSearcher>(new ContainerControlledLifetimeManager(), new InjectionFactory(container => new IndexSearcher(HostingEnvironment.MapPath("~/Data/typeahead"))));
        }
    }
}