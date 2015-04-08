using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Configuration;

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

            var cloudConnectionString = ConfigurationManager.AppSettings["LuceneBlobStorage"];

            unityContainer.RegisterType<IndexSearcher>(new ContainerControlledLifetimeManager(), new InjectionFactory(container =>
            {
                System.IO.Directory.CreateDirectory(typeaheadStore);
                var cacheDirectory = Lucene.Net.Store.FSDirectory.Open(typeaheadStore);
                var settings = container.Resolve<ISettings>();

                //var azureDirectory = new Lucene.Net.Store.Azure.AzureDirectory(Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(cloudConnectionString), settings.GetSettingsValue("Typeahead", "Cloud Container"), cacheDirectory);
                System.IO.Directory.CreateDirectory(typeaheadStore);
                var azureDirectory = Lucene.Net.Store.FSDirectory.Open(typeaheadStore);

                return new IndexSearcher(azureDirectory);
            }));
        }
    }
}