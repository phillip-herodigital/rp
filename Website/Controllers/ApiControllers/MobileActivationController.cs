using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Activation;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class MobileActivationController : ApiController
    {
        private readonly IAccountService accountService;
        private readonly IActivationCodeLookup activationCodeLookup;

        public MobileActivationController(IAccountService accountService, IActivationCodeLookup activationCodeLookup)
        {
            this.accountService = accountService;
            this.activationCodeLookup = activationCodeLookup;
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<IHttpActionResult> LookupAccountByEsn([FromBody]LookupAccountByEsnRequest request)
        {
            var esn = await activationCodeLookup.LookupEsn(request.ActivationCode) ?? request.ActivationCode;
            var acct = await accountService.FindAccountForEsn(esn, request.LastName);
            if (acct == null)
                return BadRequest("ESN not ready for activation");
            return Ok(new LookupAccountByEsnResponse
            {
                FirstName = acct.Details.ContactInfo.Name.First,
                LastName = acct.Details.ContactInfo.Name.Last,
                PhoneNumber = acct.SubAccounts.OfType<MobileAccount>().First().PhoneNumber,
                AccountNumber = acct.AccountNumber,
            });
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<bool> ActivateEsn([FromBody]ActivateEsnRequest request)
        {
            var esn = await activationCodeLookup.LookupEsn(request.ActivationCode) ?? request.ActivationCode;
            return await accountService.ActivateEsn(request.AccountNumber, esn);
        }

        [HttpPost]
        public async Task<bool> UploadActivationCodes()
        {
            // TODO - is this the right permission?
            if (!Sitecore.Context.User.IsAdministrator && !Sitecore.Context.User.IsInRole("sitecore\\Author"))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
            var text = await Request.Content.ReadAsStringAsync();

            return await activationCodeLookup.UploadCsv(text);
        }
    }
}
