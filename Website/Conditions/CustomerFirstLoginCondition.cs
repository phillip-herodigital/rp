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
        protected override bool Execute(T ruleContext)
        {
            MembershipUser user = Membership.GetUser();
            return user.LastLoginDate == user.CreationDate;
        }
    }
}