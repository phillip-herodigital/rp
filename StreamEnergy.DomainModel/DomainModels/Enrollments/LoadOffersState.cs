using StreamEnergy.Extensions;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class LoadOffersState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public LoadOffersState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(ServiceInformationState), nextState: typeof(PlanSelectionState))
        {
            this.enrollmentService = enrollmentService;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.Services.PartialValidate(e => e.Location.Address.PostalCode5,
                                                                     e => e.Location.Capabilities);
        }

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return internalContext.AllOffers == null || !context.Services.Select(s => s.Location).All(loc => internalContext.AllOffers.ContainsKey(loc));
        }

        protected override void LoadInternalState(UserContext data, InternalContext internalContext)
        {
            internalContext.AllOffers = enrollmentService.LoadOffers(data.Services.Select(s => s.Location));
        }
    }
}
