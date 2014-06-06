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
    public class RedisCacheExtensionsTest
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
        public void CacheTest()
        {
            db.CacheSet("NonSessionKey", "SomeValue");
            var actual = db.CacheGet<string>("NonSessionKey");
            Assert.AreEqual("SomeValue", actual);
        }

        [TestMethod]
        public void CacheIntegerTest()
        {
            db.CacheSet("CacheIntegerKey", 6000);
            var actual = db.CacheGet<int>("CacheIntegerKey");
            Assert.AreEqual(6000, actual);
        }

        [TestMethod]
        public void CacheLongTest()
        {
            db.CacheSet("CacheLongKey", 6000);
            var actual = db.CacheGet<long>("CacheLongKey");
            Assert.AreEqual(6000L, actual);
        }

        [TestMethod]
        public void CacheObjectTest()
        {
            TestTarget target = new TestTarget { Name = "My Test", Value = 7514 };
            db.CacheSet("CacheObjectKey", target);
            var actual = db.CacheGet<TestTarget>("CacheObjectKey");
            Assert.AreNotSame(target, actual);
            Assert.AreEqual(target.Name, actual.Name);
            Assert.AreEqual(target.Value, actual.Value);
        }

        [TestMethod]
        public void CategoryCacheTest()
        {
            db.CacheSet("AccountCategoryKey", "Categorical Value", categories: new[] { CacheCategory.Accounts });
            var actual = db.CacheGet<string>("AccountCategoryKey");
            Assert.AreEqual("Categorical Value", actual);
        }

        [TestMethod]
        public void ClearCategoryCacheTest()
        {
            db.CacheSet("AccountCategoryKey2", "New Value", categories: new[] { CacheCategory.Accounts });
            db.ClearCategoryCache(CacheCategory.Accounts);

            var actual = db.CacheGet<string>("AccountCategoryKey2");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public void SessionCacheTest()
        {
            db.CacheSet("SessionKey", "New Value", sessionId: "SESSIONID01234");
            var actual = db.CacheGet<string>("SessionKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("New Value", actual);

            actual = db.CacheGet<string>("SessionKey", sessionId: "OTHER_SESSION");
            Assert.AreEqual(null, actual);

            actual = db.CacheGet<string>("SessionKey");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public void ClearSessionCacheTest()
        {
            db.CacheSet("SessionKey", "New Value", sessionId: "SESSIONID01234");
            db.ClearSessionCache("SESSIONID01234");

            var actual = db.CacheGet<string>("SessionKey", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);
        }

        [TestMethod]
        public void SessionCategoryCacheTest()
        {
            db.CacheSet("AccountCategoryKey", "Categorical Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            var actual = db.CacheGet<string>("AccountCategoryKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("Categorical Value", actual);
        }

        [TestMethod]
        public void SessionClearCategoryCacheTest()
        {
            db.CacheSet("AccountCategoryKey2", "New Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            db.CacheSet("InvoiceCategoryKey", "Invoices", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Invoices });
            db.ClearSessionCategoryCache("SESSIONID01234", CacheCategory.Accounts);

            var actual = db.CacheGet<string>("AccountCategoryKey2", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);

            actual = db.CacheGet<string>("InvoiceCategoryKey", sessionId: "SESSIONID01234");
            Assert.AreEqual("Invoices", actual);
        }

        [TestMethod]
        public void ClearSessionCategoryCacheTest()
        {
            db.CacheSet("AccountCategoryKey2", "New Value", sessionId: "SESSIONID01234", categories: new[] { CacheCategory.Accounts });
            db.CacheSet("AccountCategoryKey2", "Other", sessionId: "OTHER_SESSION", categories: new[] { CacheCategory.Accounts });
            db.ClearSessionCache("SESSIONID01234");

            var actual = db.CacheGet<string>("AccountCategoryKey2", sessionId: "SESSIONID01234");
            Assert.AreEqual(null, actual);

            actual = db.CacheGet<string>("AccountCategoryKey2", sessionId: "OTHER_SESSION");
            Assert.AreEqual("Other", actual);
        }
    }
}
