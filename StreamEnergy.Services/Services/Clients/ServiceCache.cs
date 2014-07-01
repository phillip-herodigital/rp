using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Practices.Unity;
using StackExchange.Redis;
using StreamEnergy.Caching;
using StreamEnergy.Extensions;

namespace StreamEnergy.Services.Clients
{
    public class ServiceCache : IServiceInterceptor, IRestServiceInterceptor
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
        private readonly Dictionary<Regex, CacheConfiguration> restCacheConfigurations;
        private readonly Dictionary<Regex, CacheClearConfiguration> restCacheClearConfigurations;
        private readonly IDatabase redisDatabase;
        private readonly IUnityContainer container;

        public ServiceCache(IDatabase redisDatabase, IUnityContainer container)
        {
            this.cacheConfigurations = new Dictionary<MethodInfo, CacheConfiguration>();
            this.cacheClearConfigurations = new Dictionary<MethodInfo, CacheClearConfiguration>();
            this.restCacheConfigurations = new Dictionary<Regex, CacheConfiguration>();
            this.restCacheClearConfigurations = new Dictionary<Regex, CacheClearConfiguration>();
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

        public void Register(Regex url, bool session, TimeSpan? keepFor = null, CacheCategory[] categories = null)
        {
            restCacheConfigurations[url] = new CacheConfiguration
            {
                SessionBased = session,
                KeepFor = keepFor,
                Categories = categories
            };
        }

        public void RegisterClear(Regex url, bool session, CacheCategory[] categories = null)
        {
            restCacheClearConfigurations[url] = new CacheClearConfiguration
            {
                SessionBased = session,
                Categories = categories
            };
        }

        bool IServiceInterceptor.ApplyMock(Castle.DynamicProxy.IInvocation invocation)
        {
            if (redisDatabase == null)
            {
                return false;
            }

            if (cacheClearConfigurations.ContainsKey(invocation.Method))
            {
                Clear(cacheClearConfigurations[invocation.Method]);
            }

            if (cacheConfigurations.ContainsKey(invocation.Method))
            {
                var config = cacheConfigurations[invocation.Method];
                var request = SoapConverter.ToSoap(invocation.Arguments[0]);
                var result = RetrieveCache(config, request);
                if (result != null)
                {
                    invocation.ReturnValue = SoapConverter.FromSoap(result, invocation.Method.ReturnType);
                }
                else
                {
                    invocation.Proceed();
                    var response = SoapConverter.ToSoap(invocation.ReturnValue);
                    StoreCache(config, request, response);
                }
                return true;
            }
            else
            {
                return false;
            }
        }

        public Task<System.Net.Http.HttpResponseMessage> FindMockResponse(System.Net.Http.HttpRequestMessage request)
        {
            return Task.Run(() =>
                {
                    if (redisDatabase == null)
                    {
                        return null;
                    }

                    var clearConfig = FindMatchingConfig(request, restCacheClearConfigurations);
                    if (clearConfig.HasValue)
                    {
                        Clear(clearConfig.Value);
                    }

                    var cacheConfig = FindMatchingConfig(request, restCacheConfigurations);
                    if (cacheConfig.HasValue)
                    {
                        var config = cacheConfig.Value;
                        var result = RetrieveCache(config, request.RequestUri.ToString());
                        if (result != null)
                        {
                            return HttpConverter.ParseResponse(result);
                        }
                    }
                    return null;
                });
        }

        public async Task< System.Net.Http.HttpResponseMessage> HandleResponse(System.Net.Http.HttpRequestMessage request, System.Net.Http.HttpResponseMessage response)
        {
            var cacheConfig = FindMatchingConfig(request, restCacheConfigurations);
            if (cacheConfig.HasValue)
            {
                var config = cacheConfig.Value;
                var result = await HttpConverter.ToString(response);
                StoreCache(config, request.RequestUri.ToString(), result);
                if (result != null)
                {
                    return HttpConverter.ParseResponse(result);
                }
            }

            return response;
        }

        private T? FindMatchingConfig<T>(System.Net.Http.HttpRequestMessage request, Dictionary<Regex, T> configurations)
            where T:struct
        {
            return configurations.Where(entry => entry.Key.IsMatch(request.RequestUri.ToString())).Select(entry => (T?)entry.Value).FirstOrDefault();
        }

        private string RetrieveCache(CacheConfiguration config, string request)
        {
            string sessionId = null;
            if (config.SessionBased && TryGetSessionId(out sessionId))
            {
                // Ensure we don't get cache globally if session wasn't found
                return null;
            }
            var result = redisDatabase.CacheGet<string>(request, sessionId);
            return result;
        }

        private void StoreCache(CacheConfiguration config, string request, string response)
        {
            string sessionId = null;
            if (config.SessionBased && TryGetSessionId(out sessionId))
            {
                // Ensure we don't cache globally if session wasn't found
                return;
            }
            redisDatabase.CacheSet(request, response, expiry: config.KeepFor, sessionId: sessionId, categories: config.Categories);
        }

        private void Clear(CacheClearConfiguration config)
        {
            string sessionId;
            if (config.SessionBased && TryGetSessionId(out sessionId))
            {
                foreach (var category in config.Categories)
                {
                    redisDatabase.ClearSessionCategoryCache(sessionId, category);
                }
            }
            else
            {
                foreach (var category in config.Categories)
                {
                    redisDatabase.ClearCategoryCache(category);
                }
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
