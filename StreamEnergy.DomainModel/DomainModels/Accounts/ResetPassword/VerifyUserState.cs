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
        private readonly ISettings settings;

        public VerifyUserState(IUnityContainer container, ResetPasswordTokenManager tokenManager, IEmailService emailService, ISettings settings)
            : base(typeof(GetUsernameState), typeof(SentEmailState))
        {
            this.container = container;
            this.tokenManager = tokenManager;
            this.emailService = emailService;
            this.settings = settings;
        }

        public override IEnumerable<ValidationResult> AdditionalValidations(ResetPasswordContext context, object internalContext)
        {
            var profile = UserProfile.Locate(container, context.DomainPrefix + context.Username);

            if (!context.SendEmail)
            {
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
        }

        protected override Task<Type> InternalProcess(ResetPasswordContext context, object internalContext)
        {
            if (context.SendEmail)
            {
                var passwordResetToken = tokenManager.GetPasswordResetToken(context.Username);
                // TODO - get email address from Stream Commons
                var toEmail = "adam.powell@responsivepath.com, adam.brill@responsivepath.com, matt.dekrey@responsivepath.com";
                // TODO get base URL from Sitecore
                var url = "http://dev.streamenergy.responsivepath.com/auth/change-password?token={token}&username={username}".Format(new { token = passwordResetToken, username = context.Username });

                // Send the email
                emailService.SendEmail(new MailMessage()
                {
                    From = new MailAddress(settings.GetSettingsValue("Authorization Email Addresses", "Send From Email Address")),
                    To = { toEmail },
                    // TODO get subject and body template from Sitecore
                    Subject = "Stream Energy Reset Password",
                    IsBodyHtml = true,
                    Body = @"Click the following link to reset the password on your Stream Energy account: <a href=""{url}"">Reset Password</a>".Format(new { url = url })
                });

                return Task.FromResult(typeof(SentEmailState));
            }
            else
            {
                return Task.FromResult(typeof(VerifiedChallengeQuestionsState));
            }
        }
    }
}
