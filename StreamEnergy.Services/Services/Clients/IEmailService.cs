using System;
using System.Net;
using System.Net.Mail;
using SendGridMail;

namespace StreamEnergy.Services.Clients
{
    public interface IEmailService
    {
        bool SendEmail(MailMessage message);
    }
}
