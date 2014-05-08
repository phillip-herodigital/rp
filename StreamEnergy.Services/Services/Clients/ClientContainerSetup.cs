using Castle.DynamicProxy;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    class ClientContainerSetup : Unity.InheritanceSetupStrategy
    {
        private static readonly ProxyGenerator proxyGenerator = new ProxyGenerator();
        
        public ClientContainerSetup()
            : base(typeof(TemperatureService))
        {
        }

        protected override IEnumerable<Type> GetParentTypes(Type instanceType)
        {
            return instanceType.GetInterfaces().Where(t => t.Assembly == instanceType.Assembly).Except(new[]
            {
                typeof(IServiceMockResolver)
            });
        }

        protected override void AdditionalSetup(IUnityContainer unityContainer)
        {
            RegisterService<Sample.Temperature.TempConvertSoap>(unityContainer, new Sample.Temperature.TempConvertSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://www.w3schools.com/webservices/tempconvert.asmx")));
            RegisterService<Sample.Commons.SampleStreamCommonsSoap>(unityContainer, new Sample.Commons.SampleStreamCommonsSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://www.example.com/webservices")));
        }

        private void RegisterService<TInterface>(IUnityContainer unityContainer, TInterface soapClient)
            where TInterface : class
        {
            unityContainer.RegisterType<TInterface>(new InjectionFactory(uc => proxyGenerator.CreateInterfaceProxyWithTarget(soapClient, uc.Resolve<ServiceMockInterceptor>())));
        }
    }
}
