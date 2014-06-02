﻿using System;
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

        public static Task<bool> Set(IDatabase redis, string key, dynamic value, TimeSpan? expiry = null, string sessionId = null, CacheCategory[] categories = null)
        {
            ValidateKey(key);
            RedisValue redisValue = ConvertToRedisValue(value);

            var transaction = redis.CreateTransaction();
            var result = transaction.StringSetAsync(key, redisValue, expiry: expiry);
            Task last = SetExpirationChain(key, transaction, sessionId, categories, result);

            transaction.Execute();

            return last.ContinueWith(t => result.Result);
        }

        public static Task<bool> ClearSessionCache(IDatabase redis, string sessionId)
        {
            var key = new RedisKey[] { string.Join(" ", expiresPrefix, sessionId) };
            return TwoDeepClearCacheChain(redis, key);
        }

        private static Task<bool> TwoDeepClearCacheChain(IDatabase redis, RedisKey[] key)
        {
            return redis.ScriptEvaluateAsync(@"
for i, key in ipairs(redis.call('SMEMBERS', KEYS[1])) do
    if string.sub(key,1," + expiresPrefix.Length + @")=='" + expiresPrefix + @"' then
        for i, key2 in ipairs(redis.call('SMEMBERS', KEYS[1])) do
            redis.call('DEL', key2)
        end
    end
    redis.call(key)
end
return 1
", key).ContinueWith(eval => (bool)eval.Result);
        }

        private static Task SetExpirationChain(string key, ITransaction transaction, string sessionId, CacheCategory[] categories, Task last)
        {
            RedisKey sessionKey = new RedisKey();
            IEnumerable<string> expirationParts = Enumerable.Repeat(expiresPrefix, 1);
            if (sessionId != null)
            {
                expirationParts = expirationParts.Concat(Enumerable.Repeat(sessionId, 1));
                sessionKey = string.Join(" ", expirationParts);
                last = transaction.SetAddAsync(sessionKey, key);
            }

            if (categories != null)
            {
                foreach (var category in categories)
                {
                    var categoryKey = string.Join(" ", expirationParts.Concat(Enumerable.Repeat(category.ToString(), 1)));
                    if (sessionId != null)
                    {
                        transaction.SetAddAsync(sessionKey, categoryKey);
                    }
                    last = transaction.SetAddAsync(categoryKey, key);
                }
            }
            return last;
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
