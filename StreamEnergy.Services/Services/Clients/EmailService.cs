using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using SendGridMail;

namespace StreamEnergy.Services.Clients
{
    class EmailService : IEmailService
    {          
        // TODO - Add parameters for Template and Dictionary since they aren't included in MailMessage
        string IEmailService.SendEmail(MailMessage message)
        {
            // Create network credentials to access your SendGrid account.
            var username = Sitecore.Configuration.Settings.GetSetting("SendGrid.username", null);;
            var pswd = Sitecore.Configuration.Settings.GetSetting("SendGrid.password", null);;

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
                transportWeb.Deliver(emailMessage);
                return "Success";
            }
            catch
            {
                return "Email Failed";
            }
        }
    }
}
