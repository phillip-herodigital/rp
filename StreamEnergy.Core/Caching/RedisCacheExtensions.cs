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

        public static Task<bool> CacheSet(this IDatabaseAsync redis, string key, dynamic value, TimeSpan? expiry = null, string sessionId = null, CacheCategory[] categories = null)
        {
            ValidateKey(key);
            RedisValue redisValue = ConvertToRedisValue(value);

            if (sessionId != null)
                key = sessionId + " " + key;

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

            return redis.ScriptEvaluateAsync(script.ToString(), new RedisKey[] { key }, new RedisValue[] { redisValue }).ContinueWith(t => (bool)t.Result);
        }

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

        public static async Task<T> CacheGet<T>(this IDatabaseAsync redis, string key, string sessionId = null)
        {
            if (sessionId != null)
                key = sessionId + " " + key;

            var result = await redis.StringGetAsync(key);
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

        public static Task<bool> ClearSessionCache(this IDatabaseAsync redis, string sessionId)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, sessionId) };
            return TwoDeepClearCacheChain(redis, keys);
        }

        public static Task<bool> ClearSessionCategoryCache(this IDatabaseAsync redis, string sessionId, CacheCategory category)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, sessionId, category.ToString()) };
            return ClearCacheChain(redis, keys);
        }

        public static Task<bool> ClearCategoryCache(this IDatabaseAsync redis, CacheCategory category)
        {
            var keys = new RedisKey[] { string.Join(" ", expiresPrefix, category.ToString()) };
            return ClearCacheChain(redis, keys);
        }

        private static Task<bool> ClearCacheChain(IDatabaseAsync redis, RedisKey[] keys)
        {
            return redis.ScriptEvaluateAsync(@"
for i, key in ipairs(redis.call('SMEMBERS', KEYS[1])) do
    redis.call('DEL', key)
end
redis.call('DEL', KEYS[1])
return 1
", keys).ContinueWith(eval => (bool)eval.Result);
        }

        private static Task<bool> TwoDeepClearCacheChain(IDatabaseAsync redis, RedisKey[] keys)
        {
            return redis.ScriptEvaluateAsync(@"
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
", keys).ContinueWith(eval => (bool)eval.Result);
        }

        private static void ValidateKey(string key)
        {
            if (key.StartsWith(expiresPrefix))
            {
                throw new ArgumentException(expiresPrefix + " is a reserved prefix.");
            }
        }

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

    }
}
