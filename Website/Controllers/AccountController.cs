using StreamEnergy.DomainModels.Accounts.ResetPassword;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Account;
using StreamEnergy.MyStream.Models.Angular.GridTable;
using StreamEnergy.MyStream.Models.Authentication;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using Microsoft.Practices.Unity;

namespace StreamEnergy.MyStream.Controllers
{
    public class AccountController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item item;
        private readonly IUnityContainer container;
        private readonly Services.Clients.ITemperatureService temperatureService;
        private readonly DomainModels.Accounts.IAccountService accountService;
        private readonly Sitecore.Security.Domains.Domain domain;
        private readonly Sitecore.Data.Database database;
        private readonly ResetPasswordSessionHelper resetPasswordSessionHelper;

        #region Session Helper Classes

        public class ResetPasswordSessionHelper : StateMachineSessionHelper<ResetPasswordContext, object>
        {
            public ResetPasswordSessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(AuthenticationController), typeof(GetUsernameState), storeInternal: false)
            {
            }
        }

        #endregion

        public AccountController(IUnityContainer container, ResetPasswordSessionHelper resetPasswordSessionHelper, HttpSessionStateBase session, DomainModels.Accounts.IAccountService accountService, Services.Clients.ITemperatureService temperatureService)
        {
            this.container = container;
            this.resetPasswordSessionHelper = resetPasswordSessionHelper;
            this.temperatureService = temperatureService;
            this.accountService = accountService;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Authentication");
        }

        [HttpGet]
        public string CelciusToFahrenheit(string celcius)
        {
            return temperatureService.CelciusToFahrenheit(celcius: celcius);
        }

        #region Invoices

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public Table<Invoice> Invoices(bool schema = true)
        {
            return new Table<Invoice>
                {
                    // TODO - provide translation sitecore item
                    ColumnList = schema ? typeof(Invoice).BuildTableSchema(null) : null,
                    Values = from invoice in accountService.GetInvoices(User.Identity.Name)
                             select new Invoice
                             {
                                 AccountNumber = invoice.AccountNumber,
                                 ServiceType = invoice.ServiceType,
                                 InvoiceNumber = invoice.InvoiceNumber,
                                 InvoiceAmount = invoice.InvoiceAmount.ToString("0.00"),
                                 DueDate = invoice.DueDate.ToShortDateString(),
                                 IsPaid = invoice.IsPaid,
                                 CanRequestExtension = invoice.CanRequestExtension,
                                 Actions = 
                                 {
                                     { "viewPdf", "http://.../" }
                                 }
                             }
                };
        }

        #endregion

        #region Online Account Information

        [HttpPost]
        public GetOnlineAccountResponse GetOnlineAccount(GetOnlineAccountRequest request)
        {
            // TODO check to make sure the user is logged in

            resetPasswordSessionHelper.Reset();
            resetPasswordSessionHelper.Context.DomainPrefix = domain.AccountPrefix;
            resetPasswordSessionHelper.Context.Username = request.Username;
            resetPasswordSessionHelper.StateMachine.Process(typeof(VerifyUserState));
            
            var validations = Enumerable.Empty<ValidationResult>();
            var email = new DomainModels.Email();
            var questionsRoot = database.GetItem("/sitecore/content/Data/Taxonomy/Security Questions");
            
            // TODO get email address from Stream Connect
            email.Address = "adam.powell@responsivepath.com";
            
            
            return new GetOnlineAccountResponse
            {
                Success = true,
                Username = request.Username,
                Email = email,
                AvailableSecurityQuestions =
                    from questionItem in (questionsRoot != null ? questionsRoot.Children : Enumerable.Empty<Sitecore.Data.Items.Item>())
                    select new SecurityQuestion
                    {
                        Id = questionItem.ID.Guid,
                        Text = questionItem["Question"]
                    },
                AnsweredSecurityQuestions = 
                    from challenge in resetPasswordSessionHelper.Context.Answers ?? new Dictionary<Guid, string>()
                    let questionItem = database.GetItem(new Sitecore.Data.ID(challenge.Key))
                    select new SecurityQuestion
                    {
                        Id = challenge.Key,
                        Text = questionItem != null ? questionItem["Question"] : ""
                    },
                LanguagePreference = "English"
            };
        }

        [HttpPost]
        public UpdateOnlineAccountResponse UpdateOnlineAccount(UpdateOnlineAccountRequest request)
        {
            bool success = false;
            if (ModelState.IsValid)
            {
                var username = request.Username;
                // TODO check to make sure the user is logged in
                if (true)
                {
                    var user = Membership.GetUser(domain.AccountPrefix + username);
                    // update the username

                    // update the email address

                    // update the password
                    user.ChangePassword(user.ResetPassword(), request.Password);

                    // update the challeges

                    success = true;
                }
            }

            return new UpdateOnlineAccountResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("Change Password"))
            };
        }

        #endregion

        private Sitecore.Data.Items.Item GetAuthItem(string childItem)
        {
            return item.Children[childItem];
        }

        private void AddAuthenticationCookie(HttpResponseMessage response, string username)
        {
            var cookie = FormsAuthentication.GetAuthCookie(domain.AccountPrefix + username, false, "/");
            response.Headers.AddCookies(new[] {
                    new System.Net.Http.Headers.CookieHeaderValue(cookie.Name, cookie.Value) 
                    { 
                        Domain = cookie.Domain, 
                        Expires = cookie.Expires == DateTime.MinValue ? null : (DateTime?)cookie.Expires, 
                        HttpOnly = cookie.HttpOnly, 
                        Path = cookie.Path, 
                        Secure = cookie.Secure 
                    }
                });
        }

    }
}