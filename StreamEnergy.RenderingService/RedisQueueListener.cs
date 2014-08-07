using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace StreamEnergy.RenderingService
{
    class RedisQueueListener
    {
        private readonly IDatabase database;
        private readonly string queueKey;

        public RedisQueueListener(IDatabase database, string queueKey)
        {
            this.database = database;
            this.queueKey = queueKey;
        }

        public async Task<string> Poll()
        {
            return await database.ListLeftPopAsync(queueKey);
        }

        internal async Task Enqueue(string value)
        {
            await database.ListRightPushAsync(queueKey, value);
        }
    }
}
