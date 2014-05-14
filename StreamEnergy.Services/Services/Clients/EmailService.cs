using System;
using System.Net;
using System.Net.Mail;
using SendGridMail;

namespace StreamEnergy.Services.Clients
{
    class EmailService : IEmailService
    {   
        string IEmailService.SendEmail(MailMessage message)
        {
            // Create network credentials to access your SendGrid account.
            var username = Sitecore.Configuration.Settings.GetSetting("SendGrid.username", null);;
            var pswd = Sitecore.Configuration.Settings.GetSetting("SendGrid.password", null);;

            var credentials = new NetworkCredential(username, pswd);

            // Create the email object first, then add the properties.
            SendGrid myMessage = SendGrid.GetInstance();
            myMessage.AddTo("adam.powell@responsivepath.com");
            myMessage.From = new MailAddress("adam.powell@responsivepath.com", "Adam Powell");
            myMessage.Subject = "Testing the SendGrid Library";
            myMessage.Text = "Hello World!";

            // Create an Web transport for sending email.
            var transportWeb = SendGridMail.Web.GetInstance(credentials);

            // Send the email.
            try 
            {
                transportWeb.Deliver(myMessage);
                return "Success";
            }
            catch
            {
                return "Email Failed";
            }
            

        }
    }
}
