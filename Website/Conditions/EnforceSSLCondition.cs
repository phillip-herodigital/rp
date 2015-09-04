using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Rules.Conditions;
using Microsoft.Practices.Unity;
using StreamEnergy.StreamEnergyBilling.IstaTokenization;
using System.Collections.Specialized;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Text.RegularExpressions;

namespace StreamEnergy.MyStream.Conditions
{
    public class EnforceSSLCondition<T> : WhenCondition<T>
        where T : Sitecore.Rules.RuleContext
    {
        private Injection dependencies;

        public class Injection
        {
            [Dependency]
            public HttpContextBase Context { get; set; }

            [Dependency("SSLEnabled")]
            public bool SSLEnabled { get; set; }
        }

        public EnforceSSLCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public EnforceSSLCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            if (!HttpContext.Current.Request.IsSecureConnection && dependencies.SSLEnabled)
            {
                string url = dependencies.Context.Request.Url.ToString();
                Regex reg = new Regex("http:");
                url = reg.Replace(url, "https:", 1);

                if (url != dependencies.Context.Request.Url.ToString()) //In case HTTPS url returns non-secure connection for whatever reason
                {
                    dependencies.Context.Response.Redirect(url);
                }
            }

            return false;
        }
    }
}