using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Practices.Unity;
using Sitecore.Rules.Conditions;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts;
using System.Web.Security;

namespace StreamEnergy.MyStream.Conditions
{
    public class CustomerFirstLoginCondition<T> : WhenCondition<T>
        where T : Sitecore.Rules.RuleContext
    {
        private readonly Injection dependencies;

        public class Injection
        {
            [Dependency]
            public ICurrentUser currentUser { get; set; }
        }

        public CustomerFirstLoginCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public CustomerFirstLoginCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            var user = Membership.GetUser(dependencies.currentUser.Customer.Username);

            return true;
        }

    }
}