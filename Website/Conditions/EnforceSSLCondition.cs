﻿using System;
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
            if (!dependencies.Context.Request.IsSecureConnection && dependencies.SSLEnabled)
            {
                string url = dependencies.Context.Request.Url.ToString().StartsWith("http:") ?
                   "https:" + dependencies.Context.Request.Url.ToString().Substring(5) : dependencies.Context.Request.Url.ToString();
                dependencies.Context.Response.Redirect(url);
            }

            return false;
        }
    }
}