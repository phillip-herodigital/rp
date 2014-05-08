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
            unityContainer.RegisterType<ServiceMockResolver>(new ContainerControlledLifetimeManager());
            SetupMockResolvers(unityContainer, unityContainer.Resolve<ServiceMockResolver>());

            unityContainer.RegisterInstance(WrapService<Sample.Temperature.TempConvertSoap>(unityContainer,
                new Sample.Temperature.TempConvertSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://www.w3schools.com/webservices/tempconvert.asmx"))
            ));
        }

        private void SetupMockResolvers(IUnityContainer unityContainer, ServiceMockResolver mockResolver)
        {
            mockResolver.MockResolvers.Add(new EmbeddedResourceMockResolver(this.GetType().Assembly));

            var temp = unityContainer.Resolve<LambdaToResourceMockResolver>(new DependencyOverride(typeof(System.Reflection.Assembly), this.GetType().Assembly));
            temp.Register<Sample.Temperature.TempConvertSoap>(s => s.CelsiusToFahrenheit(null), nvc => true, "StreamEnergy.Services.Clients.Mocks.CelsiusToFahrenheit_Response.soap");
            mockResolver.MockResolvers.Add(temp);
        }

        private TInterface WrapService<TInterface>(IUnityContainer unityContainer, TInterface soapClient)
            where TInterface : class
        {
            return proxyGenerator.CreateInterfaceProxyWithTarget(soapClient, unityContainer.Resolve<ServiceMockInterceptor>());
        }
    }
}
