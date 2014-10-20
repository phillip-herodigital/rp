using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sitecore.Modules.EmailCampaign;
using Sitecore.Security.Accounts;

namespace StreamEnergy.Services.Clients
{
    class EmailContact : Contact
    {

        public EmailContact(User user)
            : base(user)
        {
        }

        public new bool IsAnonymousSubscriber
        {
            get
            {
                return base.IsAnonymousSubscriber;
            }
            set
            {
                base.IsAnonymousSubscriber = value;
            }
        }

        public new static EmailContact FromName(string userName)
        {
            EmailContact result;
            try
            {
                if (User.Exists(userName))
                {
                    result = new EmailContact(User.FromName(userName, true));
                    return result;
                }
            }
            catch (Exception)
            {
            }
            result = null;
            return result;
        }
    }
}
