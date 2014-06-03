using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StackExchange.Redis;
using StreamEnergy.Caching;

namespace StreamEnergy.Core.Tests.Caching
{
    [TestClass]
    public class RedisCacheExtensionsTest
    {
        private Microsoft.VisualStudio.TestTools.UnitTesting.TestContext testContextInstance;
        private static ConnectionMultiplexer redis;
        private IDatabase db;

        [Serializable]
        private struct TestTarget
        {
            public int Value;
            public string Name;
        }

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        [ClassInitialize()]
        public static void MyClassInitialize(TestContext testContext)
        {
            try
            {
                redis = ConnectionMultiplexer.Connect("localhost");
            }
            catch
            {
                redis = null;
            }
        }

        [TestInitialize()]
        public void MyTestInitialize()
        {
            if (redis == null)
                Assert.Inconclusive("No local redis.");

            db = redis.GetDatabase();
        }

        [TestCleanup()]
        public void MyTestCleanup()
        {
            if (redis != null)
            {
                // clean up our database - don't want extra keys lying around.
                var keys = redis.GetEndPoints().SelectMany(ep => redis.GetServer(ep).Keys()).ToArray();
                foreach (var key in keys)
                {
                    db.KeyDelete(key);
                }
            }
        }

        // This is a basic test to ensure that the redis server is working as expected - this does not test our code
        [TestMethod]
        public void SimpleTest()
        {
            db.StringSet("testKey", "value");
            var result = db.StringGet("testKey");
            Assert.AreEqual("value", result.ToString());
        }

        [TestMethod]
        public async Task CacheTest()
        {
            await db.CacheSet("NonSessionKey", "SomeValue");
            var actual = await db.CacheGet<string>("NonSessionKey");
            Assert.AreEqual("SomeValue", actual);
        }

        [TestMethod]
        public async Task CacheIntegerTest()
        {
            await db.CacheSet("CacheIntegerKey", 6000);
            var actual = await db.CacheGet<int>("CacheIntegerKey");
            Assert.AreEqual(6000, actual);
        }

        [TestMethod]
        public async Task CacheLongTest()
        {
            await db.CacheSet("CacheLongKey", 6000);
            var actual = await db.CacheGet<long>("CacheLongKey");
            Assert.AreEqual(6000L, actual);
        }

        [TestMethod]
        public async Task CacheObjectTest()
        {
            TestTarget target = new TestTarget { Name = "My Test", Value = 7514 };
            await db.CacheSet("CacheObjectKey", target);
            var actual = await db.CacheGet<TestTarget>("CacheObjectKey");
            Assert.AreNotSame(target, actual);
            Assert.AreEqual(target.Name, actual.Name);
            Assert.AreEqual(target.Value, actual.Value);
        }

        [TestMethod]
        public async Task CategoryCacheTest()
        {
            await db.CacheSet("AccountCategoryKey", "Categorical Value", categories: new[] { CacheCategory.Accounts });
            var actual = await db.CacheGet<string>("AccountCategoryKey");
            Assert.AreEqual("Categorical Value", actual);
        }

        [TestMethod]
        public async Task ClearCategoryCacheTest()
        {
            await db.CacheSet("AccountCategoryKey2", "New Value", categories: new[] { CacheCategory.Accounts });
            await db.ClearCategoryCache(CacheCategory.Accounts);

            var actual = await db.CacheGet<string>("AccountCategoryKey2");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public async Task SessionCacheTest()
        {
            await db.CacheSet("SessionKey", "New Value", sessionId: "SESSIONID01234");
            var actual = await db.CacheGet<string>("SessionKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("New Value", actual);
            
            actual = await db.CacheGet<string>("SessionKey", sessionId: "OTHER_SESSION");
            Assert.AreEqual(null, actual);

            actual = await db.CacheGet<string>("SessionKey");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public async Task ClearSessionCacheTest()
        {
            await db.CacheSet("SessionKey", "New Value", sessionId: "SESSIONID01234");
            await db.ClearSessionCache("SESSIONID01234");

            var actual = await db.CacheGet<string>("SessionKey", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public async Task SessionCategoryCacheTest()
        {
            await db.CacheSet("AccountCategoryKey", "Categorical Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            var actual = await db.CacheGet<string>("AccountCategoryKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("Categorical Value", actual);
        }

        [TestMethod]
        public async Task SessionClearCategoryCacheTest()
        {
            await db.CacheSet("AccountCategoryKey2", "New Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            await db.CacheSet("InvoiceCategoryKey", "Invoices", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Invoices });
            await db.ClearSessionCategoryCache("SESSIONID01234", CacheCategory.Accounts);

            var actual = await db.CacheGet<string>("AccountCategoryKey2", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);

            actual = await db.CacheGet<string>("InvoiceCategoryKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("Invoices", actual);
        }

        [TestMethod]
        public async Task ClearSessionCategoryCacheTest()
        {
            await db.CacheSet("AccountCategoryKey2", "New Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            await db.CacheSet("AccountCategoryKey2", "Other", sessionId: "OTHER_SESSION", categories: new[] { CacheCategory.Accounts });
            await db.ClearSessionCache("SESSIONID01234");

            var actual = await db.CacheGet<string>("AccountCategoryKey2", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);

            actual = await db.CacheGet<string>("AccountCategoryKey2", sessionId: "OTHER_SESSION");
            Assert.AreEqual("Other", actual);
        }
    }
}
