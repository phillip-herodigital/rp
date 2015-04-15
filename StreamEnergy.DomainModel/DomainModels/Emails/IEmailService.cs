using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Emails
{
    public interface IEmailService
    {
        Task<bool> SendEmail(Guid emailTemplate, string to, System.Collections.Specialized.NameValueCollection parameters = null);
        Task<bool> SendEmail(MailMessage Message);
        Task<bool> SendDynEmail(MailMessage Message);
        bool SendDynEmailSyncronous(MailMessage Message);
    }
}
