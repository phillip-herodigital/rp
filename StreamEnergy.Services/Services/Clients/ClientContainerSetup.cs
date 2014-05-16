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
            return instanceType.GetInterfaces().Except(new[]
            {
                typeof(Unity.IContainerSetupStrategy),
                typeof(IInterceptor),
                typeof(IServiceMockResolver)
            });
        }

        protected override void AdditionalSetup(IUnityContainer unityContainer)
        {
            RegisterService<Sample.Temperature.TempConvertSoap>(unityContainer, new Sample.Temperature.TempConvertSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://www.w3schools.com/webservices/tempconvert.asmx")));
            RegisterService<Sample.Commons.SampleStreamCommonsSoap>(unityContainer, new Sample.Commons.SampleStreamCommonsSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://www.example.com/webservices")));
            RegisterService<StreamCommons.Account.CisAccountServicesPortType>(unityContainer, new StreamCommons.Account.CisAccountServicesPortTypeClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://sgecom.stge.datx.streamenergy.net/CisAccountServices/WebServices/SoapServer.php?wsdl")));
            RegisterService<StreamEnergy.Dpi.DPILinkSoap>(unityContainer, new StreamEnergy.Dpi.DPILinkSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://uat.soap.dataparadigm.com:6080/dpilink.asmx?WSDL")));
        }

        private void RegisterService<TInterface>(IUnityContainer unityContainer, TInterface soapClient)
            where TInterface : class
        {
            unityContainer.RegisterType<TInterface>(new InjectionFactory(uc => proxyGenerator.CreateInterfaceProxyWithTarget(soapClient, uc.Resolve<ServiceMockInterceptor>())));
        }
    }
}
