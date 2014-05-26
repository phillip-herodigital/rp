using Microsoft.Practices.Unity;
using System.Web.Http;
using Unity.WebApi;

namespace StreamEnergy.LuceneServices.Web
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
            var container = StreamEnergy.Unity.Container.Instance.Unity;

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}