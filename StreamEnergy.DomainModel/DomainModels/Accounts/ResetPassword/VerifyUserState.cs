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
        private readonly IEmailService emailService;
        private readonly ISettings settings;

        public VerifyUserState(IUnityContainer container, IEmailService emailService, ISettings settings)
            : base(typeof(GetUsernameState), typeof(SecurityQuestionsVerifiedState))
        {
            this.container = container;
            this.emailService = emailService;
            this.settings = settings;
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
    }
}
