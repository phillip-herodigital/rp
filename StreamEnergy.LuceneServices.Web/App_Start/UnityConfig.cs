using Microsoft.Practices.Unity;
using System.Web.Http;
using Unity.WebApi;

namespace StreamEnergy.LuceneServices.Web.App_Start
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
            new StreamEnergy.Pipelines.InitializeUnityContainer().Run();

            var container = StreamEnergy.Unity.Container.Instance.Unity;

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}