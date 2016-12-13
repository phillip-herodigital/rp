using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Rules.Conditions;
using Microsoft.Practices.Unity;
using System.Collections.Specialized;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using StreamEnergy.Processes;
using StreamEnergy.DomainModels.Enrollments;
using System.Threading.Tasks;

namespace StreamEnergy.MyStream.Conditions
{
    public class HasNEEnrollmentCondition<T> : WhenCondition<T>
        where T : Sitecore.Rules.RuleContext
    {
        private Injection dependencies;

        public class Injection
        {
            [Dependency]
            public StreamEnergy.MyStream.Controllers.ApiControllers.EnrollmentController.SessionHelper stateHelper { get; set; }

        }

        public HasNEEnrollmentCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public HasNEEnrollmentCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            var result = AsyncHelper.RunSync<bool>(() => hasNEEnrollment());

            return result;
        }

        public async Task<bool> hasNEEnrollment()
        {
            await dependencies.stateHelper.EnsureInitialized().ConfigureAwait(false);

            var confirmations = dependencies.stateHelper.StateMachine.InternalContext.PlaceOrderResult;

            return confirmations.Where(entry => entry.Offer.OfferType.Contains("NewJersey") || entry.Offer.OfferType.Contains("NewYork") || entry.Offer.OfferType.Contains("Maryland") || entry.Offer.OfferType.Contains("Pennsylvania") || entry.Offer.OfferType.Contains("DCElectricity")).Any();
        }
    }
}