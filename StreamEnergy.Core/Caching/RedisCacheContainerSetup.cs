using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StackExchange.Redis;

namespace StreamEnergy.Caching
{
    class RedisCacheContainerSetup : Unity.IContainerSetupStrategy
    {
        ConnectionMultiplexer multiplexer = null;

        public RedisCacheContainerSetup()
        {
            var connString = ConfigurationManager.ConnectionStrings["redisCache"];
            if (connString != null)
            {
                try
                {
                    multiplexer = ConnectionMultiplexer.Connect(connString.ConnectionString);
                }
                catch (Exception ex)
                {
                    Sitecore.Diagnostics.Log.Warn("redisCache connection could not be made.", ex, this);
                }
            }
        }

        public void SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.RegisterType<ConnectionMultiplexer>(new InjectionFactory(container => multiplexer));
            unityContainer.RegisterType<IDatabase>(new InjectionFactory(container =>
            {
                if (multiplexer == null)
                    return null;
                return multiplexer.GetDatabase();
            }));
        }
    }
}
