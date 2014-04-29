using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace StreamEnergy
{
    class StreamEnergyModule : IHttpModule
    {
        static StreamEnergyModule instance = null;

        void IHttpModule.Dispose()
        {
            if (instance == this)
            {
                instance = null;
            }
        }

        void IHttpModule.Init(HttpApplication context)
        {
            if (instance == null)
            {
                instance = this;

                StreamEnergy.Unity.Container.Instance.Initialize(/* TODO */);

                var container = StreamEnergy.Unity.Container.Instance.Unity;

                DependencyResolver.SetResolver(new global::Unity.Mvc5.UnityDependencyResolver(container));
                GlobalConfiguration.Configuration.DependencyResolver = new global::Unity.WebApi.UnityDependencyResolver(container);
            }
        }
    }
}
