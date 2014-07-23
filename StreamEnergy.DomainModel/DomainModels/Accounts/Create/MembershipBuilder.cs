﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class MembershipBuilder
    {
        private readonly MembershipProvider membershipProvider;
        private readonly IUnityContainer unityContainer;
        private readonly IAccountService accountService;

        public MembershipBuilder(MembershipProvider membershipProvider, IUnityContainer unityContainer, IAccountService accountService)
        {
            this.membershipProvider = membershipProvider;
            this.unityContainer = unityContainer;
            this.accountService = accountService;
        }

        internal async Task<UserProfile> CreateUser(string username, string password, Dictionary<Guid, string> challengeAnswers = null)
        {
            var user = Membership.CreateUser(username, password);

            if (user == null)
            {
                return null;
            }

            // TODO - register user with Stream Connect
            var globalCustomerId = await accountService.CreateStreamConnectCustomer(username);

            var profile = UserProfile.Locate(unityContainer, username);
            profile.ChallengeQuestions = (from entry in challengeAnswers ?? new Dictionary<Guid, string>()
                                          select ChallengeResponse.Create(entry.Key, entry.Value)).ToArray();
            profile.GlobalCustomerId = globalCustomerId;

            profile.Save();

            return profile;
        }
    }
}
