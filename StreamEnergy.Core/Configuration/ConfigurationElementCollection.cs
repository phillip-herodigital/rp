using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Configuration
{
    class ConfigurationElementCollection<T, U> : System.Configuration.ConfigurationElementCollection, IEnumerable<T>
        where T : System.Configuration.ConfigurationElement, new()
        where U : class, IKeyGenerator<T>, new()
    {
        private readonly U keyGenerator;

        public ConfigurationElementCollection()
        {
            keyGenerator = new U();
        }

        public void Add(T element)
        {
            BaseAdd(element);
        }

        public void Clear()
        {
            BaseClear();
        }

        protected override System.Configuration.ConfigurationElement CreateNewElement()
        {
            return new T();
        }

        protected override object GetElementKey(System.Configuration.ConfigurationElement element)
        {
            return keyGenerator.GetKey((T)element);
        }

        public void Remove(string key)
        {
            BaseRemove(key);
        }

        IEnumerator<T> IEnumerable<T>.GetEnumerator()
        {
            return ((System.Collections.IEnumerable)this).OfType<T>().GetEnumerator();
        }

    }
}
