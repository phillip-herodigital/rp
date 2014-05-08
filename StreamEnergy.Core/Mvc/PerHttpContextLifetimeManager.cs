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

        public PerHttpContextLifetimeManager()
        {
            key = Guid.NewGuid().ToString();
        }

        public override object GetValue()
        {
            return System.Web.HttpContext.Current.Items[key];
        }

        public override void RemoveValue()
        {
            System.Web.HttpContext.Current.Items.Remove(key);
        }

        public override void SetValue(object newValue)
        {
            System.Web.HttpContext.Current.Items[key] = newValue;
        }
    }
}
