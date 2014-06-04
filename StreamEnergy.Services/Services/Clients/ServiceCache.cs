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

        private struct CacheClearConfiguration
        {
            public bool SessionBased;
            public Caching.CacheCategory[] Categories;
        }

        private readonly Dictionary<MethodInfo, CacheConfiguration> cacheConfigurations;
        private readonly Dictionary<MethodInfo, CacheClearConfiguration> cacheClearConfigurations;
        private readonly IDatabase redisDatabase;
        private readonly IUnityContainer container;

        public ServiceCache(IDatabase redisDatabase, IUnityContainer container)
        {
            this.cacheConfigurations = new Dictionary<MethodInfo, CacheConfiguration>();
            this.cacheClearConfigurations = new Dictionary<MethodInfo, CacheClearConfiguration>();
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

        public void RegisterClear<T>(Expression<Func<T, object>> service, bool session, CacheCategory[] categories = null)
        {
            var method = service.SimpleMethodCall();

            cacheClearConfigurations[method] = new CacheClearConfiguration
            {
                SessionBased = session,
                Categories = categories
            };
        }

        bool IServiceMockResolver.ApplyMock(Castle.DynamicProxy.IInvocation invocation)
        {
            if (redisDatabase == null)
            {
                return false;
            }

            if (cacheClearConfigurations.ContainsKey(invocation.Method))
            {
                string sessionId;
                if (cacheConfigurations[invocation.Method].SessionBased && TryGetSessionId(out sessionId))
                {
                    foreach (var category in cacheConfigurations[invocation.Method].Categories)
                    {
                        redisDatabase.ClearSessionCategoryCache(sessionId, category);
                    }
                }
                else
                {
                    foreach (var category in cacheConfigurations[invocation.Method].Categories)
                    {
                        redisDatabase.ClearCategoryCache(category);
                    }
                }
            }

            if (cacheConfigurations.ContainsKey(invocation.Method))
            {
                string sessionId = null;
                if (cacheConfigurations[invocation.Method].SessionBased && TryGetSessionId(out sessionId))
                {
                    // Ensure we don't cache globally if session wasn't found
                    return false;
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

        private bool TryGetSessionId(out string sessionId)
        {
            var session = container.Resolve<HttpSessionStateBase>();
            if (session != null)
            {
                sessionId = session.SessionID;
                return true;
            }
            else
            {
                sessionId = null;
                return false;
            }
        }
    }
}
