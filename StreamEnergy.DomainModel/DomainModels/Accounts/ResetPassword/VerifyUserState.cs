using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.ResetPassword
{
    public class VerifyUserState : StateBase<ResetPasswordContext, object>
    {
        private IUnityContainer container;

        public VerifyUserState(IUnityContainer container)
            : base(typeof(GetUsernameState), typeof(SentEmailState))
        {
            this.container = container;
        }

        public override IEnumerable<ValidationResult> AdditionalValidations(ResetPasswordContext context, object internalContext)
        {
            var profile = UserProfile.Locate(container, context.Username);

            if (!profile.ChallengeQuestions.Select(q => q.QuestionKey).OrderBy(guid => guid).SequenceEqual(context.ChallengeQuestions.Where(q => !string.IsNullOrEmpty(q.Value)).Select(q => q.Key).OrderBy(guid => guid)))
            {
                yield return new ValidationResult("All Questions Required", new[] { "ChallengeQuestions" });
            }
            if ((from answer in context.ChallengeQuestions
                 join originalResponse in profile.ChallengeQuestions on answer.Key equals originalResponse.QuestionKey
                 select originalResponse.IsCorrect(answer.Value)).Any(isCorrect => !isCorrect))
            {
                yield return new ValidationResult("Incorrect Response", new[] { "ChallengeQuestions" });
            }
            throw new NotImplementedException();
        }

        protected override Type InternalProcess(ResetPasswordContext context, object internalContext)
        {
            var passwordResetToken = GeneratePasswordResetToken();

            // TODO - set the password reset token with expiration... somewhere

            // TODO - send the email

            return base.InternalProcess(context, internalContext);
        }

        private static string GeneratePasswordResetToken()
        {
            byte[] array = new byte[8];
            new System.Security.Cryptography.RNGCryptoServiceProvider().GetBytes(array);
            return Convert.ToBase64String(array);
        }
    }
}
