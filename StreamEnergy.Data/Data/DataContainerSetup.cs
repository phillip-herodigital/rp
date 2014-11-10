using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Data
{
    class DataContainerSetup : Unity.InheritanceSetupStrategy
    {
        public DataContainerSetup()
            : base(typeof(MobileEnrollment.MobileEnrollmentService))
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
            
        }

        private void RegisterService<TInterface>(IUnityContainer unityContainer, TInterface soapClient)
            where TInterface : class
        {
            unityContainer.RegisterType<TInterface>(new InjectionFactory(uc => soapClient));
        }
    }
}
