using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Mvc
{
    public class PerHttpContextLifetimeManager : LifetimeManager
    {
        private readonly string key;
        private readonly Func<System.Web.HttpContext> getContext;

        public PerHttpContextLifetimeManager(Func<System.Web.HttpContext> getContext)
        {
            this.key = Guid.NewGuid().ToString();
            this.getContext = getContext;
        }

        public override object GetValue()
        {
            return getContext().Items[key];
        }

        public override void RemoveValue()
        {
            getContext().Items.Remove(key);
        }

        public override void SetValue(object newValue)
        {
            getContext().Items[key] = newValue;
        }
    }
}
