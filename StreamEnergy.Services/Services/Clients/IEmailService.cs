using System;
using System.Net;
using System.Net.Mail;
using SendGridMail;

namespace StreamEnergy.Services.Clients
{
    public interface IEmailService
    {
        string SendEmail(MailMessage message);
    }
}
