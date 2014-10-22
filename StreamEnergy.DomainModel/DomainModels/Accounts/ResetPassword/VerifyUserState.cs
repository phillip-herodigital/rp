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
using System.Collections.Specialized;

namespace StreamEnergy.DomainModels.Accounts.ResetPassword
{
    public class VerifyUserState : StateBase<ResetPasswordContext, object>
    {
        private readonly IUnityContainer container;
        private readonly ResetPasswordTokenManager tokenManager;
        private readonly IEmailService emailService;
        private readonly ISettings settings;
        private readonly UserProfileLocator userProfileLocator;
        private readonly IAccountService accountService;
        private readonly Func<HttpContextBase> getContext;

        public VerifyUserState(IUnityContainer container, ResetPasswordTokenManager tokenManager, IEmailService emailService, ISettings settings, UserProfileLocator userProfileLocator, IAccountService accountService, Func<HttpContextBase> getContext)
            : base(typeof(GetUsernameState), typeof(SentEmailState))
        {
            this.container = container;
            this.tokenManager = tokenManager;
            this.emailService = emailService;
            this.settings = settings;
            this.userProfileLocator = userProfileLocator;
            this.accountService = accountService;
            this.getContext = getContext;
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

        protected override async Task<Type> InternalProcess(ResetPasswordContext context, object internalContext)
        {
            if (context.SendEmail)
            {
                var passwordResetToken = tokenManager.GetPasswordResetToken(context.Username);

                var profile = userProfileLocator.Locate(context.DomainPrefix + context.Username);
                var customer = await accountService.GetCustomerByCustomerId(profile.GlobalCustomerId);
                var toEmail = customer.EmailAddress;
                var url = new Uri(getContext().Request.Url, "/auth/change-password?token={token}&username={username}".Format(new { token = passwordResetToken, username = context.Username })).ToString();

                await emailService.SendEmail(new Guid("{82785A09-611A-449A-B186-B283A3DF65C5}"), toEmail, new NameValueCollection() {
                    {"url", url}
                });

                return typeof(SentEmailState);
            }
            else
            {
                return typeof(VerifiedChallengeQuestionsState);
            }
        }
    }
}
