using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace StreamEnergy.Caching
{
    public static class RedisCacheExtensions
    {
        const string expiresPrefix = "$$EXPIRES";
        const string ClearCacheChainScript = @"
for i, key in ipairs(redis.call('SMEMBERS', KEYS[1])) do
    redis.call('DEL', key)
end
redis.call('DEL', KEYS[1])
return 1
";
        static readonly string TwoDeepClearCacheChainScript = @"
for i, key in ipairs(redis.call('SMEMBERS', KEYS[1])) do
    if string.sub(key,1," + expiresPrefix.Length + @")=='" + expiresPrefix + @"' then
        for i, key2 in ipairs(redis.call('SMEMBERS', KEYS[1])) do
            redis.call('DEL', key2)
        end
    end
    redis.call('DEL', key)
end
redis.call('DEL', KEYS[1])
return 1
";


        public static bool CacheSet(this IDatabase redis, string key, dynamic value, TimeSpan? expiry = null, string sessionId = null, CacheCategory[] categories = null)
        {
            ValidateKey(key);
            key = AdjustKeyForSession(key, sessionId);

            RedisValue redisValue = ConvertToRedisValue(value);
            
            try
            {
                return (bool)redis.ScriptEvaluate(BuildScript(key, sessionId, categories), new RedisKey[] { key }, new RedisValue[] { redisValue });
            }
            catch (RedisConnectionException)
            {
                return false;
            }
        }

        public static async Task<bool> CacheSetAsync(this IDatabaseAsync redis, string key, dynamic value, TimeSpan? expiry = null, string sessionId = null, CacheCategory[] categories = null)
        {
            ValidateKey(key);
            key = AdjustKeyForSession(key, sessionId);
      
            RedisValue redisValue = ConvertToRedisValue(value);

            try 
            {
                return (bool)await redis.ScriptEvaluateAsync(BuildScript(key, sessionId, categories), new RedisKey[] { key }, new RedisValue[] { redisValue });
            }
            catch (RedisConnectionException)
            {
                return false;
            }
        }

        public static T CacheGet<T>(this IDatabase redis, string key, string sessionId = null)
        {
            ValidateKey(key);
            key = AdjustKeyForSession(key, sessionId);
            try
            {
                var result = redis.StringGet(key);
                return ConvertFromRedisValue<T>(result);
            } 
            catch (RedisConnectionException)
            {
                return default(T);
            }
        }

        public static async Task<T> CacheGetAsync<T>(this IDatabaseAsync redis, string key, string sessionId = null)
        {
            ValidateKey(key);
            key = AdjustKeyForSession(key, sessionId);
            try
            {
                var result = await redis.StringGetAsync(key);
                return ConvertFromRedisValue<T>(result);
            }
            catch (RedisConnectionException)
            {
                return default(T);
            }
        }

        public static bool ClearSessionCache(this IDatabase redis, string sessionId)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, sessionId) };
            return (bool)redis.ScriptEvaluate(TwoDeepClearCacheChainScript, keys);
        }

        public static async Task<bool> ClearSessionCacheAsync(this IDatabaseAsync redis, string sessionId)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, sessionId) };
            return (bool)await redis.ScriptEvaluateAsync(TwoDeepClearCacheChainScript, keys);
        }

        public static bool ClearSessionCategoryCache(this IDatabase redis, string sessionId, CacheCategory category)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, sessionId, category.ToString()) };
            return (bool)redis.ScriptEvaluate(ClearCacheChainScript, keys);
        }

        public static async Task<bool> ClearSessionCategoryCacheAsync(this IDatabaseAsync redis, string sessionId, CacheCategory category)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, sessionId, category.ToString()) };
            return (bool)await redis.ScriptEvaluateAsync(ClearCacheChainScript, keys);
        }

        public static bool ClearCategoryCache(this IDatabase redis, CacheCategory category)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, category.ToString()) };
            return (bool)redis.ScriptEvaluate(ClearCacheChainScript, keys);
        }

        public static async Task<bool> ClearCategoryCacheAsync(this IDatabaseAsync redis, CacheCategory category)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, category.ToString()) };
            return (bool)await redis.ScriptEvaluateAsync(ClearCacheChainScript, keys);
        }

        #region Key Validation/manipulation
        private static void ValidateKey(string key)
        {
            if (key.StartsWith(expiresPrefix))
            {
                throw new ArgumentException(expiresPrefix + " is a reserved prefix.");
            }
        }

        private static string AdjustKeyForSession(string key, string sessionId)
        {
            if (sessionId != null)
                key = sessionId + " " + key;
            return key;
        }
        #endregion

        #region Convert to/from RedisValue

        private static RedisValue ConvertToRedisValue(dynamic value)
        {
            RedisValue redisValue;
            if (value != null)
            {
                try
                {
                    redisValue = value;
                }
                catch
                {
                    // can't convert, so serialize it
                    using (MemoryStream ms = new MemoryStream())
                    {
                        var formatter = new BinaryFormatter();
                        formatter.Serialize(ms, (object)value);
                        redisValue = ms.ToArray();
                    }
                }
            }
            else
            {
                redisValue = RedisValue.Null;
            }
            return redisValue;
        }

        private static T ConvertFromRedisValue<T>(RedisValue result)
        {
            try
            {
                return (T)(dynamic)result;
            }
            catch
            {
                // can't convert, so deserialize it
                using (MemoryStream ms = new MemoryStream((byte[])result))
                {
                    var formatter = new BinaryFormatter();
                    return (T)formatter.Deserialize(ms);
                }
            }
        }

        #endregion

        #region Script building/running

        private static string BuildScript(string key, string sessionId, CacheCategory[] categories)
        {
            // Using a script rather than a transaction so that we can reduce the requirement from IDatabase to 
            // IDatabaseAsync - this way someone could put a transaction around multiple CacheSet calls if they want.
            var script = new StringBuilder();
            script.AppendLine("redis.call('SET', KEYS[1], ARGV[1])");
            IEnumerable<string> expirationParts = Enumerable.Repeat(expiresPrefix, 1);
            string sessionKey = null;
            if (sessionId != null)
            {
                expirationParts = expirationParts.Concat(Enumerable.Repeat(sessionId, 1));
                sessionKey = string.Join(" ", expirationParts);
                if (categories == null || categories.Length == 0)
                {
                    script.AppendLine(CreateScriptAddCacheKey(sessionKey, key));
                }
            }
            if (categories != null)
            {
                AppendLines(script, from category in categories
                                    let categoryKey = string.Join(" ", expirationParts.Concat(Enumerable.Repeat(category.ToString(), 1)))
                                    select CreateScriptAddCacheKey(categoryKey, key));
                if (sessionId != null)
                {
                    AppendLines(script, from category in categories
                                        let categoryKey = string.Join(" ", expirationParts.Concat(Enumerable.Repeat(category.ToString(), 1)))
                                        select CreateScriptAddCacheKey(sessionKey, key));
                }
            }
            return script.ToString();
        }

        #endregion

        private static void AppendLines(StringBuilder script, IEnumerable<string> lines)
        {
            foreach (var line in lines)
            {
                script.AppendLine(line);
            }
        }

        private static string CreateScriptAddCacheKey(string key, string value)
        {
            return "redis.call('SADD', '" + key + "', '" + value + "')";
        }

    }
}
