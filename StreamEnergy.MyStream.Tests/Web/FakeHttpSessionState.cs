using System.Collections.Specialized;
using System.IO;
using System.Web;
using System.Web.SessionState;

namespace FakeN.Web
{
    public class FakeHttpSessionState : HttpSessionStateBase
    {
        private readonly SessionStateCollection data;
        public int codePage;
        public HttpSessionStateBase contents;
        public HttpCookieMode cookieMode;
        public bool isCookieless;
        public bool isNewSession;
        public bool isReadOnly;
        public int lcid;
        public SessionStateMode mode;
        public string sessionId;
        public HttpStaticObjectsCollectionBase staticObjects;
        public int timeout;
        public int count;
        public bool isSynchronized;
        public object syncRoot;

        public FakeHttpSessionState()
        {
            data = new SessionStateCollection();
        }

        public override object this[string name]
        {
            get { return data[name]; }
            set { data[name] = value; }
        }

        public override void Add(string name, object value)
        {
            data[name] = value;
        }

        public override NameObjectCollectionBase.KeysCollection Keys
        {
            get { return data.Keys; }
        }

        private class SessionStateCollection : NameObjectCollectionBase
        {
            public object this[string key]
            {
                get { return BaseGet(key); }
                set
                {
                    if (value != null)
                    {
                        var serializer = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
                        using (var ms = new MemoryStream())
                        {
                            try
                            {
                                serializer.Serialize(ms, value);
                            }
                            catch (System.Exception ex)
                            {
                                throw new System.InvalidOperationException("All objects placed into session must be serializable.", ex);
                            }
                        }
                    }
                    BaseSet(key, value);
                }
            }
        }

        public override int CodePage { get { return codePage; } set { codePage = value; } }
        public override HttpSessionStateBase Contents { get { return contents; } }
        public override HttpCookieMode CookieMode { get { return cookieMode; } }
        public override bool IsCookieless { get { return isCookieless; } }
        public override bool IsNewSession { get { return isNewSession; } }
        public override bool IsReadOnly { get { return isReadOnly; } }
        public override int LCID { get { return lcid; } set { lcid = value; } }
        public override SessionStateMode Mode { get { return mode; } }
        public override string SessionID { get { return sessionId; } }
        public override HttpStaticObjectsCollectionBase StaticObjects { get { return staticObjects; } }
        public override int Timeout { get { return timeout; } set { timeout = value; } }
        public override int Count { get { return count; } }
        public override bool IsSynchronized { get { return isSynchronized; } }
        public override object SyncRoot { get { return syncRoot; } }
    }
}