using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Practices.Unity;
using StackExchange.Redis;
using StreamEnergy.Caching;
using StreamEnergy.Extensions;

namespace StreamEnergy.Services.Clients
{
    public class ServiceCache : IServiceMockResolver
    {
        private struct CacheConfiguration
        {
            public bool SessionBased;
            public TimeSpan? KeepFor;
            public Caching.CacheCategory[] Categories;
        }

        private readonly Dictionary<MethodInfo, CacheConfiguration> cacheConfigurations;
        private readonly IDatabase redisDatabase;
        private readonly IUnityContainer container;

        public ServiceCache(IDatabase redisDatabase, IUnityContainer container)
        {
            this.cacheConfigurations = new Dictionary<MethodInfo, CacheConfiguration>();
            this.redisDatabase = redisDatabase;
            this.container = container;
        }

        public void Register<T>(Expression<Func<T, object>> service, bool session, TimeSpan? keepFor = null, CacheCategory[] categories = null)
        {
            var method = service.SimpleMethodCall();

            cacheConfigurations[method] = new CacheConfiguration
            {
                SessionBased = session,
                KeepFor = keepFor,
                Categories = categories
            };
        }

        bool IServiceMockResolver.ApplyMock(Castle.DynamicProxy.IInvocation invocation)
        {
            if (redisDatabase == null)
            {
                return false;
            }
            if (cacheConfigurations.ContainsKey(invocation.Method))
            {
                string sessionId = null;
                if (cacheConfigurations[invocation.Method].SessionBased)
                {
                    var session = container.Resolve<HttpSessionStateBase>();
                    if (session != null)
                    {
                        sessionId = session.SessionID;
                    }
                    else
                    {
                        // Ensure that we don't cache globally if we don't have a session.
                        return false;
                    }
                }
                var request = SoapConverter.ToSoap(invocation.Arguments[0]);
                var result = redisDatabase.CacheGet<string>(request, sessionId);
                if (result != null)
                {
                    invocation.ReturnValue = SoapConverter.FromSoap(result, invocation.Method.ReturnType);
                }
                else
                {
                    invocation.Proceed();
                    var response = SoapConverter.ToSoap(invocation.ReturnValue);
                    redisDatabase.CacheSet(request, response, expiry: cacheConfigurations[invocation.Method].KeepFor, sessionId: sessionId, categories: cacheConfigurations[invocation.Method].Categories);
                }
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
