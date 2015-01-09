using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StackExchange.Redis;

namespace StreamEnergy.UserMigration.Kubra
{
    class SimpleStringRedisFake : IDatabase
    {
        private Dictionary<string, RedisValue> data = new Dictionary<string, RedisValue>();

        IBatch IDatabase.CreateBatch(object asyncState)
        {
            throw new NotImplementedException();
        }

        ITransaction IDatabase.CreateTransaction(object asyncState)
        {
            throw new NotImplementedException();
        }

        int IDatabase.Database
        {
            get { throw new NotImplementedException(); }
        }

        RedisValue IDatabase.DebugObject(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        double IDatabase.HashDecrement(RedisKey key, RedisValue hashField, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.HashDecrement(RedisKey key, RedisValue hashField, long value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.HashDelete(RedisKey key, RedisValue[] hashFields, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.HashDelete(RedisKey key, RedisValue hashField, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.HashExists(RedisKey key, RedisValue hashField, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.HashGet(RedisKey key, RedisValue[] hashFields, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.HashGet(RedisKey key, RedisValue hashField, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        HashEntry[] IDatabase.HashGetAll(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        double IDatabase.HashIncrement(RedisKey key, RedisValue hashField, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.HashIncrement(RedisKey key, RedisValue hashField, long value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.HashKeys(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.HashLength(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        IEnumerable<HashEntry> IDatabase.HashScan(RedisKey key, RedisValue pattern, int pageSize, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.HashSet(RedisKey key, RedisValue hashField, RedisValue value, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        void IDatabase.HashSet(RedisKey key, HashEntry[] hashFields, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.HashValues(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.HyperLogLogAdd(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.HyperLogLogAdd(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.HyperLogLogLength(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        void IDatabase.HyperLogLogMerge(RedisKey destination, RedisKey[] sourceKeys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        void IDatabase.HyperLogLogMerge(RedisKey destination, RedisKey first, RedisKey second, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Net.EndPoint IDatabase.IdentifyEndpoint(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.KeyDelete(RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.KeyDelete(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        byte[] IDatabase.KeyDump(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.KeyExists(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.KeyExpire(RedisKey key, DateTime? expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.KeyExpire(RedisKey key, TimeSpan? expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        void IDatabase.KeyMigrate(RedisKey key, System.Net.EndPoint toServer, int toDatabase, int timeoutMilliseconds, MigrateOptions migrateOptions, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.KeyMove(RedisKey key, int database, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.KeyPersist(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisKey IDatabase.KeyRandom(CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.KeyRename(RedisKey key, RedisKey newKey, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        void IDatabase.KeyRestore(RedisKey key, byte[] value, TimeSpan? expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        TimeSpan? IDatabase.KeyTimeToLive(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisType IDatabase.KeyType(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.ListGetByIndex(RedisKey key, long index, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.ListInsertAfter(RedisKey key, RedisValue pivot, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.ListInsertBefore(RedisKey key, RedisValue pivot, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.ListLeftPop(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.ListLeftPush(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.ListLeftPush(RedisKey key, RedisValue value, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.ListLength(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.ListRange(RedisKey key, long start, long stop, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.ListRemove(RedisKey key, RedisValue value, long count, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.ListRightPop(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.ListRightPopLeftPush(RedisKey source, RedisKey destination, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.ListRightPush(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.ListRightPush(RedisKey key, RedisValue value, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        void IDatabase.ListSetByIndex(RedisKey key, long index, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        void IDatabase.ListTrim(RedisKey key, long start, long stop, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.LockExtend(RedisKey key, RedisValue value, TimeSpan expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.LockQuery(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.LockRelease(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.LockTake(RedisKey key, RedisValue value, TimeSpan expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.Publish(RedisChannel channel, RedisValue message, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisResult IDatabase.ScriptEvaluate(byte[] hash, RedisKey[] keys, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisResult IDatabase.ScriptEvaluate(string script, RedisKey[] keys, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SetAdd(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.SetAdd(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.SetCombine(SetOperation operation, RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.SetCombine(SetOperation operation, RedisKey first, RedisKey second, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SetCombineAndStore(SetOperation operation, RedisKey destination, RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SetCombineAndStore(SetOperation operation, RedisKey destination, RedisKey first, RedisKey second, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.SetContains(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SetLength(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.SetMembers(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.SetMove(RedisKey source, RedisKey destination, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.SetPop(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.SetRandomMember(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.SetRandomMembers(RedisKey key, long count, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SetRemove(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.SetRemove(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        IEnumerable<RedisValue> IDatabase.SetScan(RedisKey key, RedisValue pattern, int pageSize, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.Sort(RedisKey key, long skip, long take, Order order, SortType sortType, RedisValue by, RedisValue[] get, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortAndStore(RedisKey destination, RedisKey key, long skip, long take, Order order, SortType sortType, RedisValue by, RedisValue[] get, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetAdd(RedisKey key, SortedSetEntry[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.SortedSetAdd(RedisKey key, RedisValue member, double score, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetCombineAndStore(SetOperation operation, RedisKey destination, RedisKey[] keys, double[] weights, Aggregate aggregate, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetCombineAndStore(SetOperation operation, RedisKey destination, RedisKey first, RedisKey second, Aggregate aggregate, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        double IDatabase.SortedSetDecrement(RedisKey key, RedisValue member, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        double IDatabase.SortedSetIncrement(RedisKey key, RedisValue member, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetLength(RedisKey key, double min, double max, Exclude exclude, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetLengthByValue(RedisKey key, RedisValue min, RedisValue max, Exclude exclude, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.SortedSetRangeByRank(RedisKey key, long start, long stop, Order order, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        SortedSetEntry[] IDatabase.SortedSetRangeByRankWithScores(RedisKey key, long start, long stop, Order order, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.SortedSetRangeByScore(RedisKey key, double start, double stop, Exclude exclude, Order order, long skip, long take, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        SortedSetEntry[] IDatabase.SortedSetRangeByScoreWithScores(RedisKey key, double start, double stop, Exclude exclude, Order order, long skip, long take, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.SortedSetRangeByValue(RedisKey key, RedisValue min, RedisValue max, Exclude exclude, long skip, long take, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long? IDatabase.SortedSetRank(RedisKey key, RedisValue member, Order order, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetRemove(RedisKey key, RedisValue[] members, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.SortedSetRemove(RedisKey key, RedisValue member, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetRemoveRangeByRank(RedisKey key, long start, long stop, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetRemoveRangeByScore(RedisKey key, double start, double stop, Exclude exclude, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.SortedSetRemoveRangeByValue(RedisKey key, RedisValue min, RedisValue max, Exclude exclude, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        IEnumerable<SortedSetEntry> IDatabase.SortedSetScan(RedisKey key, RedisValue pattern, int pageSize, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        double? IDatabase.SortedSetScore(RedisKey key, RedisValue member, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.StringAppend(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.StringBitCount(RedisKey key, long start, long end, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.StringBitOperation(Bitwise operation, RedisKey destination, RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.StringBitOperation(Bitwise operation, RedisKey destination, RedisKey first, RedisKey second, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.StringBitPosition(RedisKey key, bool bit, long start, long end, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        double IDatabase.StringDecrement(RedisKey key, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.StringDecrement(RedisKey key, long value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue[] IDatabase.StringGet(RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.StringGet(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.StringGetBit(RedisKey key, long offset, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.StringGetRange(RedisKey key, long start, long end, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.StringGetSet(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValueWithExpiry IDatabase.StringGetWithExpiry(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        double IDatabase.StringIncrement(RedisKey key, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.StringIncrement(RedisKey key, long value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        long IDatabase.StringLength(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.StringSet(KeyValuePair<RedisKey, RedisValue>[] values, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.StringSet(RedisKey key, RedisValue value, TimeSpan? expiry, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabase.StringSetBit(RedisKey key, long offset, bool bit, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        RedisValue IDatabase.StringSetRange(RedisKey key, long offset, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        TimeSpan IRedis.Ping(CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        ConnectionMultiplexer IRedisAsync.Multiplexer
        {
            get { throw new NotImplementedException(); }
        }

        System.Threading.Tasks.Task<TimeSpan> IRedisAsync.PingAsync(CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IRedisAsync.TryWait(System.Threading.Tasks.Task task)
        {
            throw new NotImplementedException();
        }

        T IRedisAsync.Wait<T>(System.Threading.Tasks.Task<T> task)
        {
            throw new NotImplementedException();
        }

        void IRedisAsync.Wait(System.Threading.Tasks.Task task)
        {
            throw new NotImplementedException();
        }

        void IRedisAsync.WaitAll(params System.Threading.Tasks.Task[] tasks)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.DebugObjectAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<double> IDatabaseAsync.HashDecrementAsync(RedisKey key, RedisValue hashField, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.HashDecrementAsync(RedisKey key, RedisValue hashField, long value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.HashDeleteAsync(RedisKey key, RedisValue[] hashFields, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.HashDeleteAsync(RedisKey key, RedisValue hashField, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.HashExistsAsync(RedisKey key, RedisValue hashField, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<HashEntry[]> IDatabaseAsync.HashGetAllAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.HashGetAsync(RedisKey key, RedisValue[] hashFields, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.HashGetAsync(RedisKey key, RedisValue hashField, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<double> IDatabaseAsync.HashIncrementAsync(RedisKey key, RedisValue hashField, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.HashIncrementAsync(RedisKey key, RedisValue hashField, long value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.HashKeysAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.HashLengthAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.HashSetAsync(RedisKey key, RedisValue hashField, RedisValue value, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task IDatabaseAsync.HashSetAsync(RedisKey key, HashEntry[] hashFields, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.HashValuesAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.HyperLogLogAddAsync(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.HyperLogLogAddAsync(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.HyperLogLogLengthAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task IDatabaseAsync.HyperLogLogMergeAsync(RedisKey destination, RedisKey[] sourceKeys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task IDatabaseAsync.HyperLogLogMergeAsync(RedisKey destination, RedisKey first, RedisKey second, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<System.Net.EndPoint> IDatabaseAsync.IdentifyEndpointAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        bool IDatabaseAsync.IsConnected(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.KeyDeleteAsync(RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.KeyDeleteAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<byte[]> IDatabaseAsync.KeyDumpAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.KeyExistsAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.KeyExpireAsync(RedisKey key, DateTime? expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.KeyExpireAsync(RedisKey key, TimeSpan? expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task IDatabaseAsync.KeyMigrateAsync(RedisKey key, System.Net.EndPoint toServer, int toDatabase, int timeoutMilliseconds, MigrateOptions migrateOptions, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.KeyMoveAsync(RedisKey key, int database, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.KeyPersistAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisKey> IDatabaseAsync.KeyRandomAsync(CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.KeyRenameAsync(RedisKey key, RedisKey newKey, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task IDatabaseAsync.KeyRestoreAsync(RedisKey key, byte[] value, TimeSpan? expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<TimeSpan?> IDatabaseAsync.KeyTimeToLiveAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisType> IDatabaseAsync.KeyTypeAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.ListGetByIndexAsync(RedisKey key, long index, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.ListInsertAfterAsync(RedisKey key, RedisValue pivot, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.ListInsertBeforeAsync(RedisKey key, RedisValue pivot, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.ListLeftPopAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.ListLeftPushAsync(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.ListLeftPushAsync(RedisKey key, RedisValue value, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.ListLengthAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.ListRangeAsync(RedisKey key, long start, long stop, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.ListRemoveAsync(RedisKey key, RedisValue value, long count, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.ListRightPopAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.ListRightPopLeftPushAsync(RedisKey source, RedisKey destination, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.ListRightPushAsync(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.ListRightPushAsync(RedisKey key, RedisValue value, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task IDatabaseAsync.ListSetByIndexAsync(RedisKey key, long index, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task IDatabaseAsync.ListTrimAsync(RedisKey key, long start, long stop, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.LockExtendAsync(RedisKey key, RedisValue value, TimeSpan expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.LockQueryAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.LockReleaseAsync(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.LockTakeAsync(RedisKey key, RedisValue value, TimeSpan expiry, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.PublishAsync(RedisChannel channel, RedisValue message, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisResult> IDatabaseAsync.ScriptEvaluateAsync(byte[] hash, RedisKey[] keys, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisResult> IDatabaseAsync.ScriptEvaluateAsync(string script, RedisKey[] keys, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SetAddAsync(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.SetAddAsync(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SetCombineAndStoreAsync(SetOperation operation, RedisKey destination, RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SetCombineAndStoreAsync(SetOperation operation, RedisKey destination, RedisKey first, RedisKey second, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.SetCombineAsync(SetOperation operation, RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.SetCombineAsync(SetOperation operation, RedisKey first, RedisKey second, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.SetContainsAsync(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SetLengthAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.SetMembersAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.SetMoveAsync(RedisKey source, RedisKey destination, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.SetPopAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.SetRandomMemberAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.SetRandomMembersAsync(RedisKey key, long count, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SetRemoveAsync(RedisKey key, RedisValue[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.SetRemoveAsync(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortAndStoreAsync(RedisKey destination, RedisKey key, long skip, long take, Order order, SortType sortType, RedisValue by, RedisValue[] get, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.SortAsync(RedisKey key, long skip, long take, Order order, SortType sortType, RedisValue by, RedisValue[] get, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetAddAsync(RedisKey key, SortedSetEntry[] values, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.SortedSetAddAsync(RedisKey key, RedisValue member, double score, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetCombineAndStoreAsync(SetOperation operation, RedisKey destination, RedisKey[] keys, double[] weights, Aggregate aggregate, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetCombineAndStoreAsync(SetOperation operation, RedisKey destination, RedisKey first, RedisKey second, Aggregate aggregate, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<double> IDatabaseAsync.SortedSetDecrementAsync(RedisKey key, RedisValue member, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<double> IDatabaseAsync.SortedSetIncrementAsync(RedisKey key, RedisValue member, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetLengthAsync(RedisKey key, double min, double max, Exclude exclude, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetLengthByValueAsync(RedisKey key, RedisValue min, RedisValue max, Exclude exclude, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.SortedSetRangeByRankAsync(RedisKey key, long start, long stop, Order order, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<SortedSetEntry[]> IDatabaseAsync.SortedSetRangeByRankWithScoresAsync(RedisKey key, long start, long stop, Order order, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.SortedSetRangeByScoreAsync(RedisKey key, double start, double stop, Exclude exclude, Order order, long skip, long take, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<SortedSetEntry[]> IDatabaseAsync.SortedSetRangeByScoreWithScoresAsync(RedisKey key, double start, double stop, Exclude exclude, Order order, long skip, long take, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.SortedSetRangeByValueAsync(RedisKey key, RedisValue min, RedisValue max, Exclude exclude, long skip, long take, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long?> IDatabaseAsync.SortedSetRankAsync(RedisKey key, RedisValue member, Order order, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetRemoveAsync(RedisKey key, RedisValue[] members, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.SortedSetRemoveAsync(RedisKey key, RedisValue member, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetRemoveRangeByRankAsync(RedisKey key, long start, long stop, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetRemoveRangeByScoreAsync(RedisKey key, double start, double stop, Exclude exclude, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.SortedSetRemoveRangeByValueAsync(RedisKey key, RedisValue min, RedisValue max, Exclude exclude, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<double?> IDatabaseAsync.SortedSetScoreAsync(RedisKey key, RedisValue member, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.StringAppendAsync(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.StringBitCountAsync(RedisKey key, long start, long end, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.StringBitOperationAsync(Bitwise operation, RedisKey destination, RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.StringBitOperationAsync(Bitwise operation, RedisKey destination, RedisKey first, RedisKey second, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.StringBitPositionAsync(RedisKey key, bool bit, long start, long end, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<double> IDatabaseAsync.StringDecrementAsync(RedisKey key, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.StringDecrementAsync(RedisKey key, long value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue[]> IDatabaseAsync.StringGetAsync(RedisKey[] keys, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.StringGetAsync(RedisKey key, CommandFlags flags)
        {
            if (data.ContainsKey(key.ToString()))
            {
                return System.Threading.Tasks.Task.FromResult(data[key.ToString()]);
            }
            return System.Threading.Tasks.Task.FromResult((RedisValue)(string)null);
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.StringGetBitAsync(RedisKey key, long offset, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.StringGetRangeAsync(RedisKey key, long start, long end, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.StringGetSetAsync(RedisKey key, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValueWithExpiry> IDatabaseAsync.StringGetWithExpiryAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<double> IDatabaseAsync.StringIncrementAsync(RedisKey key, double value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.StringIncrementAsync(RedisKey key, long value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<long> IDatabaseAsync.StringLengthAsync(RedisKey key, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.StringSetAsync(KeyValuePair<RedisKey, RedisValue>[] values, When when, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.StringSetAsync(RedisKey key, RedisValue value, TimeSpan? expiry, When when, CommandFlags flags)
        {
            data[key.ToString()] = value;
            return System.Threading.Tasks.Task.FromResult(true);
        }

        System.Threading.Tasks.Task<bool> IDatabaseAsync.StringSetBitAsync(RedisKey key, long offset, bool bit, CommandFlags flags)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<RedisValue> IDatabaseAsync.StringSetRangeAsync(RedisKey key, long offset, RedisValue value, CommandFlags flags)
        {
            throw new NotImplementedException();
        }
    }
}
