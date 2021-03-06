﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class FindAccountState : StateBase<CreateAccountContext, CreateAccountInternalContext>
    {
        private readonly IAccountService service;
        private readonly IDatabase redis;
        private const string redisPrefix = "CreateOnlineAccount_FindAccount_";

        public FindAccountState(IAccountService service, IDatabase redis)
            : base(null, typeof(AccountInformationState))
        {
            this.service = service;
            this.redis = redis;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<CreateAccountContext, object>>> PreconditionValidations(CreateAccountContext data, CreateAccountInternalContext internalContext)
        {
            yield return context => context.AccountNumber;
            yield return context => context.SsnLastFour;
        }

        public override IEnumerable<ValidationResult> AdditionalValidations(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            var value = (int?) redis.StringGet(redisPrefix + context.AccountNumber);
            if (value != null && value >= 5)
            {
                // locked out after 5 tries
                yield return new ValidationResult("Account Locked", new[] { "AccountNumber" });
            }
        }

        protected override async Task<Type> InternalProcess(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            internalContext.Account = await service.GetAccountDetails(context.AccountNumber, context.SsnLastFour);
            if (internalContext.Account == null)
            {
                await redis.StringIncrementAsync(redisPrefix + context.AccountNumber);
                await redis.KeyExpireAsync(redisPrefix + context.AccountNumber, TimeSpan.FromMinutes(30));
            }

            if (internalContext.Account == null)
            {
                // account not found
                return this.GetType();
            }

            await service.GetAccountDetails(internalContext.Account);

            if (!new EmailAddressAttribute().IsValid(internalContext.Account.Details.ContactInfo.Email.Address))
            {
                // account in invalid state for an online account - this case is handled by the front end.
                // TODO - should do this on the back-end more completely.
                internalContext.Account.Details.ContactInfo.Email.Address = "";
            }

            context.Customer = internalContext.Account.Details.ContactInfo;            
            context.Address = internalContext.Account.Details.BillingAddress;
            context.AccountNumber = internalContext.Account.AccountNumber;
            return await base.InternalProcess(context, internalContext);
        }

        public override bool ForceBreak(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            if (internalContext.Account == null)
            {
                // account not found
                return true;
            }
            return base.ForceBreak(context, internalContext);
        }
    }
}
