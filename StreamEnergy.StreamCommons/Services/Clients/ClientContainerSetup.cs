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
            return instanceType.GetInterfaces().Where(t => t.Assembly == instanceType.Assembly);
        }

        protected override void AdditionalSetup(IUnityContainer unityContainer)
        {
            unityContainer.RegisterInstance(WrapService<Sample.Temperature.TempConvertSoap>(
                new Sample.Temperature.TempConvertSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://www.w3schools.com/webservices/tempconvert.asmx"))
            ));
        }

        private TInterface WrapService<TInterface>(TInterface soapClient)
            where TInterface : class
        {
            return proxyGenerator.CreateInterfaceProxyWithTarget(soapClient, new ServiceMockInterceptor());
        }
    }
}
