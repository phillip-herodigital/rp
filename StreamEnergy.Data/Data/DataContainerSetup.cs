using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Microsoft.WindowsAzure.Storage;

namespace StreamEnergy.Data
{
    class DataContainerSetup : Unity.InheritanceSetupStrategy
    {
        public DataContainerSetup()
            : base(typeof(MobileEnrollment.MobileEnrollmentService), typeof(Documents.DocumentStore))
        {
        }

        protected override IEnumerable<Type> GetParentTypes(Type instanceType)
        {
            return instanceType.GetInterfaces().Except(new[]
            {
                typeof(IDisposable),
                typeof(IObjectContextAdapter),
                typeof(Unity.IContainerSetupStrategy),
            });
        }

        protected override void AdditionalSetup(IUnityContainer unityContainer)
        {
            unityContainer.RegisterType<MobileEnrollment.DataContext>(new HierarchicalLifetimeManager());

            var documentStorageConnectionString = ConfigurationManager.ConnectionStrings["documents"].ConnectionString;
            var azureStorageConnectionString = ConfigurationManager.ConnectionStrings["azureStorage"].ConnectionString;
            var activationCodeConnectionString = ConfigurationManager.ConnectionStrings["activationCodes"].ConnectionString;
            var cloudStorageAccount = CloudStorageAccount.Parse(azureStorageConnectionString);

            unityContainer.RegisterInstance(cloudStorageAccount);
            unityContainer.RegisterInstance(Documents.DocumentStore.SqlConnectionString, documentStorageConnectionString);
            unityContainer.RegisterInstance(Documents.DocumentStore.CloudStorageContainerFormat, ConfigurationManager.AppSettings[Documents.DocumentStore.CloudStorageContainerFormat]);
            unityContainer.RegisterInstance(Activation.ActivationCodeLookup.SqlConnectionString, activationCodeConnectionString);
            unityContainer.RegisterType<DomainModels.Activation.IActivationCodeLookup, Activation.ActivationCodeLookup>();
        }

        private void RegisterService<TInterface>(IUnityContainer unityContainer, TInterface soapClient)
            where TInterface : class
        {
            unityContainer.RegisterType<TInterface>(new InjectionFactory(uc => soapClient));
        }
    }
}
