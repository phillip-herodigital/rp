using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StackExchange.Redis;
using StreamEnergy.Caching;

namespace StreamEnergy.Core.Tests.Caching
{
    [TestClass]
    public class RedisCacheExtensionsAsyncTest
    {
        private Microsoft.VisualStudio.TestTools.UnitTesting.TestContext testContextInstance;
        private static ConnectionMultiplexer redis;
        private IDatabase db;
        private static UnityContainer unityContainer;

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
            unityContainer = new UnityContainer();
            new RedisCacheContainerSetup().SetupUnity(unityContainer);
            redis = unityContainer.Resolve<ConnectionMultiplexer>();
        }

        [TestInitialize()]
        public void MyTestInitialize()
        {
            db = unityContainer.Resolve<IDatabase>();

            if (db == null)
                Assert.Inconclusive("No redis connection.");
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
            await db.CacheSetAsync("NonSessionKey", "SomeValue");
            var actual = await db.CacheGetAsync<string>("NonSessionKey");
            Assert.AreEqual("SomeValue", actual);
        }

        [TestMethod]
        public async Task CacheIntegerTest()
        {
            await db.CacheSetAsync("CacheIntegerKey", 6000);
            var actual = await db.CacheGetAsync<int>("CacheIntegerKey");
            Assert.AreEqual(6000, actual);
        }

        [TestMethod]
        public async Task CacheLongTest()
        {
            await db.CacheSetAsync("CacheLongKey", 6000);
            var actual = await db.CacheGetAsync<long>("CacheLongKey");
            Assert.AreEqual(6000L, actual);
        }

        [TestMethod]
        public async Task CacheObjectTest()
        {
            TestTarget target = new TestTarget { Name = "My Test", Value = 7514 };
            await db.CacheSetAsync("CacheObjectKey", target);
            var actual = await db.CacheGetAsync<TestTarget>("CacheObjectKey");
            Assert.AreNotSame(target, actual);
            Assert.AreEqual(target.Name, actual.Name);
            Assert.AreEqual(target.Value, actual.Value);
        }

        [TestMethod]
        public async Task CategoryCacheTest()
        {
            await db.CacheSetAsync("AccountCategoryKey", "Categorical Value", categories: new[] { CacheCategory.Accounts });
            var actual = await db.CacheGetAsync<string>("AccountCategoryKey");
            Assert.AreEqual("Categorical Value", actual);
        }

        [TestMethod]
        public async Task ClearCategoryCacheTest()
        {
            await db.CacheSetAsync("AccountCategoryKey2", "New Value", categories: new[] { CacheCategory.Accounts });
            await db.ClearCategoryCacheAsync(CacheCategory.Accounts);

            var actual = await db.CacheGetAsync<string>("AccountCategoryKey2");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public async Task SessionCacheTest()
        {
            await db.CacheSetAsync("SessionKey", "New Value", sessionId: "SESSIONID01234");
            var actual = await db.CacheGetAsync<string>("SessionKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("New Value", actual);
            
            actual = await db.CacheGetAsync<string>("SessionKey", sessionId: "OTHER_SESSION");
            Assert.AreEqual(null, actual);

            actual = await db.CacheGetAsync<string>("SessionKey");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public async Task ClearSessionCacheTest()
        {
            await db.CacheSetAsync("SessionKey", "New Value", sessionId: "SESSIONID01234");
            await db.ClearSessionCacheAsync("SESSIONID01234");

            var actual = await db.CacheGetAsync<string>("SessionKey", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public async Task SessionCategoryCacheTest()
        {
            await db.CacheSetAsync("AccountCategoryKey", "Categorical Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            var actual = await db.CacheGetAsync<string>("AccountCategoryKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("Categorical Value", actual);
        }

        [TestMethod]
        public async Task SessionClearCategoryCacheTest()
        {
            await db.CacheSetAsync("AccountCategoryKey2", "New Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            await db.CacheSetAsync("InvoiceCategoryKey", "Invoices", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Invoices });
            await db.ClearSessionCategoryCacheAsync("SESSIONID01234", CacheCategory.Accounts);

            var actual = await db.CacheGetAsync<string>("AccountCategoryKey2", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);

            actual = await db.CacheGetAsync<string>("InvoiceCategoryKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("Invoices", actual);
        }

        [TestMethod]
        public async Task ClearSessionCategoryCacheTest()
        {
            await db.CacheSetAsync("AccountCategoryKey2", "New Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            await db.CacheSetAsync("AccountCategoryKey2", "Other", sessionId: "OTHER_SESSION", categories: new[] { CacheCategory.Accounts });
            await db.ClearSessionCacheAsync("SESSIONID01234");

            var actual = await db.CacheGetAsync<string>("AccountCategoryKey2", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);

            actual = await db.CacheGetAsync<string>("AccountCategoryKey2", sessionId: "OTHER_SESSION");
            Assert.AreEqual("Other", actual);
        }
    }
}
