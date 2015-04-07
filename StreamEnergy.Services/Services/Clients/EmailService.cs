using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using SendGridMail;
using StreamEnergy.DomainModels.Emails;
using Sitecore.Modules.EmailCampaign;
using System.Web.Security;

namespace StreamEnergy.Services.Clients
{
    class EmailService : IEmailService
    {


        async Task<bool> IEmailService.SendEmail(MailMessage message)
        {
            // Create network credentials to access your SendGrid account.
            var username = Sitecore.Configuration.Settings.GetSetting("SendGrid.username", null);
            var pswd = Sitecore.Configuration.Settings.GetSetting("SendGrid.password", null);

            var credentials = new NetworkCredential(username, pswd);

            // Create the email object first, then add the properties.
            SendGrid emailMessage = SendGrid.GetInstance();

            // Add multiple addresses to the To field.
            var recipients = message.To;

            foreach (var recipient in recipients)
            {
                emailMessage.AddTo(recipient.ToString());
            }

            emailMessage.From = message.From;
            emailMessage.Subject = message.Subject;
            if (message.IsBodyHtml)
            {
                emailMessage.Html = message.Body;
            }
            else
            {
                emailMessage.Text = message.Body;
            }

            // Create an Web transport for sending email.
            var transportWeb = SendGridMail.Web.GetInstance(credentials);

            // Send the email.
            try
            {
                await transportWeb.DeliverAsync(emailMessage).ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }

        Task<bool> IEmailService.SendEmail(Guid emailTemplate, string to, System.Collections.Specialized.NameValueCollection parameters)
        {
            var itemMessage = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID(emailTemplate));
            
            /*
            var managerRoot = Factory.GetAllManagerRoots()[0];
            var contact = GetAnonymousFromEmail(to, managerRoot);
            var mi = Factory.GetMessage(itemMessage);
            
            if (parameters != null)
            {
                foreach (var key in parameters.AllKeys) 
                {
                    mi.CustomPersonTokens[key] = parameters[key];
                }
            }
            var messageBody = mi.GetMessageBody();
            messageBody = messageBody.Replace("=\"/sitecore/shell/", "=\"" + managerRoot.Settings.BaseURL + "/");
            */

            Sitecore.Links.UrlOptions urlOptions = new Sitecore.Links.UrlOptions();
            urlOptions.AlwaysIncludeServerUrl = true;
            var url = Sitecore.Links.LinkManager.GetItemUrl(itemMessage, urlOptions);
            WebClient w = new WebClient();
            var messageBody = w.DownloadString(url);
            if (parameters != null)
            {
                foreach (var key in parameters.AllKeys)
                {
                    messageBody = messageBody.Replace("$" + key + "$", parameters[key]);
                }
            }

            var message = new MailMessage(itemMessage.Fields["From Address"].Value, to, itemMessage.Fields["Subject"].Value, messageBody)
            {
                IsBodyHtml = true,
            };
            return ((IEmailService)this).SendEmail(message);

            //var sm = new AsyncSendingManager(mi);
            //var results = sm.SendStandardMessage(contact);

            //return Task.FromResult(string.IsNullOrEmpty(results.Errors));
        }

        public static Contact GetAnonymousFromEmail(string email, ManagerRoot root)
        {
            Contact contact = null;
            if (root != null && Util.IsValidEmail(email))
            {
                string commonDomain = root.Settings.CommonDomain;
                var membershipUserCollection = Membership.FindUsersByEmail(email);
                foreach (MembershipUser membershipUser in membershipUserCollection)
                {
                    Contact contact2 = Contact.FromName(membershipUser.UserName);
                    if (contact2.IsAnonymousSubscriber)
                    {
                        contact = contact2;
                        if (Sitecore.Security.Domains.Domain.ExtractDomainName(membershipUser.UserName).Equals(commonDomain, StringComparison.OrdinalIgnoreCase))
                        {
                            break;
                        }
                    }
                }
                if (contact == null)
                {
                    contact = CreateAnonymous(email, root);
                }
            }
            return contact;
        }

        protected static Contact CreateAnonymous(string localName, ManagerRoot root)
        {
            EmailContact contact = null;
            if (root != null && !string.IsNullOrEmpty(localName))
            {
                string commonDomain = root.Settings.CommonDomain;
                string text = commonDomain + "\\" + Util.AddressToUserName(localName);
                while (Sitecore.Security.Accounts.User.Exists(text))
                {
                    text += "_";
                }
                string password = new Sitecore.SecurityModel.Cryptography.PasswordGenerator
                {
                    MinimumCharacters = 14
                }.Generate().Substring(0, 14) + "aA1!";
                Membership.CreateUser(text, password, localName);
                contact = EmailContact.FromName(text);
                contact.IsAnonymousSubscriber = true;
                contact.Profile.ProfileItemId = root.Settings.SubscriberProfile;
                contact.Profile.Save();
            }
            return contact;
        }
    }
}
