using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.Practices.Unity;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class CreateAccountState : StateBase<CreateAccountContext, CreateAccountInternalContext>
    {
        private readonly IUnityContainer unityContainer;

        public CreateAccountState(IUnityContainer unityContainer)
            :base(typeof(AccountInformationState), typeof(CompleteState))
        {
            this.unityContainer = unityContainer;
        }

        protected override async Task<Type> InternalProcess(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            var user = Membership.CreateUser(context.Username, context.Password);

            if (user == null)
            {
                return typeof(CreateFailedState);
            }

            var profile = UserProfile.Locate(unityContainer, context.Username);
            profile.ChallengeQuestions = (from entry in context.Challenges
                                          select ChallengeResponse.Create(entry.Key, entry.Value)).ToArray();

            profile.Save();

            // TODO - register user with Stream Connect

            return await base.InternalProcess(context, internalContext);
        }
    }
}
