using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Rules.Conditions;
using System.Web.Security;
using Sitecore.Diagnostics;
using Sitecore.Data;
using Sitecore.Data.Items;

namespace StreamEnergy.MyStream.Conditions
{
    public class CustomerDismissedModalCondition<T> : WhenCondition<T> 
        where T : Sitecore.Rules.RuleContext
    {
        private ID itemId;

        public ID ItemId
        {
            get
            {
                return this.itemId;
            }
            set
            {
                Assert.ArgumentNotNull(value, "value");
                this.itemId = value;
            }
        }
        
        public string Value
        {
            get;
            set;
        }

        public CustomerDismissedModalCondition()
		{
			this.itemId = ID.Null;
		}

        protected override bool Execute(T ruleContext)
        {
            MembershipUser _user = Membership.GetUser();
            Sitecore.Security.Accounts.User securityAccountUser = Sitecore.Security.Accounts.User.FromName(_user.UserName, true);

            if (securityAccountUser != null)
            {
                Assert.ArgumentNotNull(ruleContext, "ruleContext");
                string alreadyDismissedInterstitials = Sitecore.Context.User.Profile.GetCustomProperty("Dismissed Interstitals");
                var dismissedInterstials = StreamEnergy.Json.Read<List<dynamic>>(alreadyDismissedInterstitials);
                string itemGuid = this.itemId.Guid.ToString();
                string value = this.Value ?? string.Empty;
                if (this.itemId == ID.Null || dismissedInterstials == null)
                {
                    return false;
                }
                if (string.IsNullOrEmpty(value))
                {
                    return dismissedInterstials.Any(d => d.itemId == itemGuid);
                }
                else
                {
                    var dismissedItem = dismissedInterstials.SingleOrDefault(d => d.itemId == itemGuid);
                    if (dismissedItem != null)
                    {
                        DateTime dismissedDate = Convert.ToDateTime(dismissedItem.date);
                        var timeDifference = (DateTime.Now - dismissedDate).TotalDays;
                        return timeDifference < Convert.ToDouble(value);
                    }
                    else
                    {
                        return false;
                    }
                }
            } 
            else
            {
                return false;
            }
        }

    }
}