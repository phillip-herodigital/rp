using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Services.Clients.Interceptors
{
    class ServiceCacheContainerSetup : Unity.IContainerSetupStrategy
    {
        public void SetupUnity(IUnityContainer unityContainer)
        {
            var mockResolver = unityContainer.Resolve<ServiceInterceptorResolver>();

            var cacheSetup = unityContainer.Resolve<ServiceCache>();
            mockResolver.MockResolvers.Add(cacheSetup);
            mockResolver.RestMockResolvers.Add(cacheSetup);

            cacheSetup.Register<Sample.Temperature.TempConvertSoap>(s => s.CelsiusToFahrenheit(null), session: false, keepFor: TimeSpan.FromMinutes(5));

            cacheSetup.Register(new System.Text.RegularExpressions.Regex("^http://graph\\.facebook\\.com/me$"), session: true, keepFor: TimeSpan.FromMinutes(5));
        }

    }
}
