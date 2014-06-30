using System;
using System.Net;
using System.Net.Mail;

namespace StreamEnergy.DomainModels.Emails
{
    public interface IEmailService
    {
        bool SendEmail(MailMessage message);
    }
}
