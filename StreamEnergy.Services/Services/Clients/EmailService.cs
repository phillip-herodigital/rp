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

        async Task<bool> IEmailService.SendDynEmail(MailMessage message)
        {
            var username = Sitecore.Configuration.Settings.GetSetting("DynEtc.username", null);
            var pswd = Sitecore.Configuration.Settings.GetSetting("DynEtc.password", null);
            var host = Sitecore.Configuration.Settings.GetSetting("DynEtc.server", null);

            SmtpClient client = new SmtpClient();
            client.Host = host;
            client.Port = 25;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(username, pswd);
            client.Timeout = 10000;

            try
            {
                await client.SendMailAsync(message);
                return true;
            }
            catch
            {
                return false;
            }
        }

        bool IEmailService.SendDynEmailSyncronous(MailMessage message)
        {
            var username = Sitecore.Configuration.Settings.GetSetting("DynEtc.username", null);
            var pswd = Sitecore.Configuration.Settings.GetSetting("DynEtc.password", null);
            var host = Sitecore.Configuration.Settings.GetSetting("DynEtc.server", null);

            SmtpClient client = new SmtpClient();
            client.Host = host;
            client.Port = 25;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(username, pswd);
            client.Timeout = 10000;

            try
            {
                client.Send(message);
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
            return ((IEmailService)this).SendDynEmail(message);
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
