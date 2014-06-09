using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StreamEnergy.Processes;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Emails;
using StreamEnergy.Extensions;
using System.Web;

namespace StreamEnergy.DomainModels.Accounts.ResetPassword
{
    public class VerifyUserState : StateBase<ResetPasswordContext, object>
    {
        private readonly IUnityContainer container;
        private readonly ResetPasswordTokenManager tokenManager;
        private readonly IEmailService emailService;
        private readonly HttpRequestBase request;

        public VerifyUserState(IUnityContainer container, ResetPasswordTokenManager tokenManager, IEmailService emailService, HttpRequestBase request)
            : base(typeof(GetUsernameState), typeof(SentEmailState))
        {
            this.container = container;
            this.tokenManager = tokenManager;
            this.emailService = emailService;
            this.request = request;
        }

        public override IEnumerable<ValidationResult> AdditionalValidations(ResetPasswordContext context, object internalContext)
        {
            var profile = UserProfile.Locate(container, context.DomainPrefix + context.Username);

            var questions = profile.ChallengeQuestions ?? new ChallengeResponse[0];
            if (context.Answers == null || !questions.Select(q => q.QuestionKey).OrderBy(guid => guid).SequenceEqual(context.Answers.Where(q => !string.IsNullOrEmpty(q.Value)).Select(q => q.Key).OrderBy(guid => guid)))
            {
                yield return new ValidationResult("All Questions Required", new[] { "ChallengeQuestions" });
            }
            else if ((from answer in context.Answers
                      join originalResponse in questions on answer.Key equals originalResponse.QuestionKey
                      select originalResponse.IsCorrect(answer.Value)).Any(isCorrect => !isCorrect))
            {
                yield return new ValidationResult("Incorrect Response", new[] { "ChallengeQuestions" });
            }
        }

        protected override Type InternalProcess(ResetPasswordContext context, object internalContext)
        {
            var passwordResetToken = tokenManager.GetPasswordResetToken(context.Username);
            
            // TODO - get email address from Stream Commons
            var toEmail = "adam.powell@responsivepath.com, , adam.brill@responsivepath.com, matt.dekrey@responsivepath.com";

            // Get the From address from Sitecore;
            var settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
            var fromEmail = settings.GetSettingsValue("Authorization Email Addresses", "Send From Email Address");

            // Send the email
            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromEmail);
            message.To.Add(toEmail);
            // TODO get supject and body template from Sitecore
            message.Subject = "Stream Energy Reset Password";
            message.IsBodyHtml = true;
            message.Body = "Click the following link to reset the password on your Stream Energy account: <a href=\"" + new Uri(request.Url, "/auth/change-password?token={token}&username={username}".Format(new { token = passwordResetToken, username = context.Username })).ToString() + "\">Reset Password</a>";
            
            emailService.SendEmail(message);

            return base.InternalProcess(context, internalContext);
            
        }
    }
}
