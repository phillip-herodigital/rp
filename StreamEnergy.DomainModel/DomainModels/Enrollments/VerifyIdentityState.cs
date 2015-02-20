using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class VerifyIdentityState : StateBase<UserContext, InternalContext>
    {
        public VerifyIdentityState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(LoadIdentityQuestionsState), nextState: typeof(SubmitIdentityState))
        {
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations(UserContext data, InternalContext internalContext)
        {
            yield return context => context.Services;
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.TaxId;
            yield return context => context.ContactTitle;
            yield return context => context.DoingBusinessAs;
            yield return context => context.PreferredSalesExecutive;
            yield return context => context.SelectedIdentityAnswers;
            yield return context => context.OnlineAccount;
        }
    }
}
