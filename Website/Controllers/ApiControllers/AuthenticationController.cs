﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using Microsoft.Practices.Unity;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Accounts.Create;
using StreamEnergy.DomainModels.Accounts.ResetPassword;
using StreamEnergy.DomainModels.Emails;
using StreamEnergy.Extensions;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Authentication;
using StreamEnergy.Processes;
using StreamEnergy.Services.Clients;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using System.Collections.Specialized;
using System.Text;
using ResponsivePath.Logging;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class AuthenticationController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item item;
        private readonly IUnityContainer container;
        private readonly CreateAccountSessionHelper coaSessionHelper;
        private readonly ResetPasswordSessionHelper resetPasswordSessionHelper;
        private readonly ResetPasswordTokenManager resetPasswordTokenManager;
        private readonly Sitecore.Security.Domains.Domain domain;
        private readonly Sitecore.Data.Database database;
        private readonly IEmailService emailService;
        private readonly ISettings settings;
        private readonly IAccountService accountService;
        private readonly ImpersonationUtility impersonation;
        private readonly UserProfileLocator profileLocator;
        private readonly ILogger logger;
        private Models.Account.KubraLoginHelper kubraLoginHelper;
        
        #region Session Helper Classes
        public class CreateAccountSessionHelper : StateMachineSessionHelper<CreateAccountContext, CreateAccountInternalContext>
        {
            public CreateAccountSessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(AuthenticationController), typeof(FindAccountState), storeInternal: true)
            {
            }
        }

        public class ResetPasswordSessionHelper : StateMachineSessionHelper<ResetPasswordContext, object>
        {
            public ResetPasswordSessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(AuthenticationController), typeof(GetUsernameState), storeInternal: false)
            {
            }
        }
        #endregion

        public AuthenticationController(IUnityContainer container, CreateAccountSessionHelper coaSessionHelper, ResetPasswordSessionHelper resetPasswordSessionHelper, ResetPasswordTokenManager resetPasswordTokenManager, IEmailService emailService, ISettings settings, IAccountService accountService, ImpersonationUtility impersonation, UserProfileLocator profileLocator, ILogger logger, Models.Account.KubraLoginHelper kubraLoginHelper)
        {
            this.container = container;
            this.coaSessionHelper = coaSessionHelper;
            this.resetPasswordSessionHelper = resetPasswordSessionHelper;
            this.resetPasswordTokenManager = resetPasswordTokenManager;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Authentication");
            this.emailService = emailService;
            this.accountService = accountService;
            this.settings = settings;
            this.impersonation = impersonation;
            this.profileLocator = profileLocator;
            this.logger = logger;
            this.kubraLoginHelper = kubraLoginHelper;
        }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            Initialize().Wait();
            base.Initialize(controllerContext);
        }

        public async Task Initialize()
        {
            await Task.WhenAll(
                coaSessionHelper.EnsureInitialized(),
                resetPasswordSessionHelper.EnsureInitialized());
        }

        protected override void Dispose(bool disposing)
        {
            coaSessionHelper.Dispose();
            resetPasswordSessionHelper.Dispose();

            base.Dispose(disposing);
        }

        #region Login

        [HttpPost]
        public Task<HttpResponseMessage> Login(LoginRequest request)
        {
            /*if (!string.IsNullOrEmpty(settings.GetSettingsValue("Maintenance Mode", "Ista Maintenance Mode")))
            {
                return Task.FromResult(Request.CreateResponse(new
                {
                    Success = true,
                    ReturnURI = "/ga-upgrade-faq",
                }));
            }*/
            request.Domain = domain;
            ModelState.Clear();
            Validate(request, "request");
            if (ModelState.IsValid)
            {
               return Task.FromResult(HandleValidLogin(request));
            }
            else
            {
                var prefixedUsername = request.Domain.AccountPrefix + request.Username;
                var profile = profileLocator.Locate(prefixedUsername);
                if (profile != null && profile.ImportSource != null)
                {
                    // we do something special for imported users
                    switch (profile.ImportSource.Value)
                    {
                        case ImportSource.GeorgiaAccounts:
                            return Task.FromResult(Request.CreateResponse(new
                                {
                                    Redirect = "/en/auth/reset-password?username=" + request.Username
                                }));
                        case ImportSource.KubraAccounts:
                            return kubraLoginHelper.Login(request).ContinueWith(loginTask =>
                                {
                                    if (loginTask.Result)
                                    {
                                        // update password to match, since it was a successful authentication

                                        var user = Membership.GetUser(prefixedUsername);
                                        try
                                        {
                                            user.ChangePassword(user.ResetPassword(), request.Password);
                                        }
                                        catch
                                        {

                                            var passwordResetToken = resetPasswordTokenManager.GetPasswordResetToken(request.Username);

                                            var uri = "/auth/change-password?token={token}&username={username}&import={import}".Format(new { token = HttpUtility.UrlEncode(passwordResetToken), username = HttpUtility.UrlEncode(request.Username), import = ImportSource.KubraAccounts.ToString() });

                                            // password requirements stronger than given password
                                            return Request.CreateResponse(new
                                            {
                                                Redirect = uri
                                            });
                                        }

                                        return HandleValidLogin(request);
                                    }
                                    else
                                        return HandleInvalidLogin();
                                });
                    }
                }
            }

            return Task.FromResult(HandleInvalidLogin());
        }

        [HttpPost]
        public Task<HttpResponseMessage> CallcenterLogin(LoginRequest request)
        {
            request.Domain = domain;
            ModelState.Clear();
            var accessgroup = settings.GetSettingsValue("Impersonation", "Access Group");
            var prefixedUsername = request.Domain.AccountPrefix + request.Username;

            Validate(request, "request");
            if (ModelState.IsValid && Sitecore.Security.Accounts.User.Exists(prefixedUsername))
            {
                Sitecore.Security.Accounts.User user = Sitecore.Security.Accounts.User.FromName(prefixedUsername, false);
                if (user.IsInRole(accessgroup))
                {
                    var response = Request.CreateResponse(new LoginResponse()
                    {
                        Success = true,
                        ReturnURI = "/impersonate"
                    });
                    AddAuthenticationCookie(response, request.Username);
                    return Task.FromResult(response);
                }
            }

            return Task.FromResult(HandleInvalidLogin());
        }

        private HttpResponseMessage HandleValidLogin(LoginRequest request)
        {
            // validate the return URI
            Uri requestUri = new Uri(request.Uri);
            var queryString = HttpUtility.ParseQueryString(requestUri.Query);
            string returnUri = HttpUtility.UrlDecode(queryString["url"]) ??  HttpUtility.UrlDecode(queryString["item"]);

            var helper = new System.Web.Mvc.UrlHelper(System.Web.HttpContext.Current.Request.RequestContext);

            if (string.IsNullOrEmpty(returnUri) || !helper.IsLocalUrl(returnUri))
            {
                returnUri = "/account/interstitial";
            }

            var response = Request.CreateResponse(new LoginResponse()
            {
                Success = true,
                ReturnURI = returnUri
            });

            if (request.RememberMe)
                AddRememberMeCookie(response, request.Username);
            else
                RemoveRememberMeCookie(response);

            AddAuthenticationCookie(response, request.Username);
            return response;
        }

        private HttpResponseMessage HandleInvalidLogin()
        {
            return Request.CreateResponse(new LoginResponse
            {
                Success = false,
                Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("My Stream Account"))
            });
        }

        #endregion

        #region Logout

        [HttpGet]
        public HttpResponseMessage Logout()
        {
            Dispose(true);
            HttpContext.Current.Session.Abandon();
            var response = Request.CreateResponse(HttpStatusCode.Found);
            response.Headers.Location = new Uri(Request.RequestUri, "/auth/login");
            return response;
        }

        [HttpGet]
        public HttpResponseMessage AppLogout() {
            Dispose(true);
            HttpContext.Current.Session.Abandon();
            var response = Request.CreateResponse(HttpStatusCode.Found);
            response.Headers.Location = new Uri(Request.RequestUri, "/mobileapp/index.html");

            return response;

        }

        [HttpGet]
        public HttpResponseMessage CallcenterLogout()
        {
            Dispose(true);
            HttpContext.Current.Session.Abandon();
            var response = Request.CreateResponse(HttpStatusCode.Found);
            response.Headers.Location = new Uri(Request.RequestUri, "/");
            return response;
        }

        #endregion

        #region Create Online Account

        [HttpPost]
        public async Task<FindAccountResponse> FindAccount(FindAccountRequest request)
        {
            if (coaSessionHelper.StateMachine.State != typeof(FindAccountState))
            {
                coaSessionHelper.Reset();
                await coaSessionHelper.EnsureInitialized();
            }

            coaSessionHelper.StateMachine.Context.AccountNumber = request.AccountNumber;
            coaSessionHelper.StateMachine.Context.SsnLastFour = request.SsnLastFour;

            if (coaSessionHelper.StateMachine.State == typeof(FindAccountState))
                await coaSessionHelper.StateMachine.Process(typeof(AccountInformationState));

            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (coaSessionHelper.StateMachine.State == typeof(FindAccountState))
            {
                validations = coaSessionHelper.StateMachine.ValidationResults;
                if (!validations.Any())
                {
                    validations = Enumerable.Repeat(new ValidationResult("Account Number Invalid", new[] { "AccountNumber" }), 1);
                }
            }
                
            var questionsRoot = database.GetItem("/sitecore/content/Data/Taxonomy/Security Questions");
            return new FindAccountResponse
            {
                AccountNumber = coaSessionHelper.StateMachine.Context.AccountNumber,
                SsnLastFour = coaSessionHelper.StateMachine.Context.SsnLastFour,
                Customer = coaSessionHelper.StateMachine.Context.Customer,
                Address = coaSessionHelper.StateMachine.Context.Address,
                AvailableSecurityQuestions =
                    from questionItem in (questionsRoot != null ? questionsRoot.Children : Enumerable.Empty<Sitecore.Data.Items.Item>())
                    select new SecurityQuestion
                    {
                        Id = questionItem.ID.Guid,
                        Text = questionItem["Question"]
                    },
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Create Account - Step 1"))
            };
        }

        [HttpPost]
        public async Task<UpdateEmailResponse> UpdateEmail(UpdateEmailRequest request)
        {
            var details = coaSessionHelper.InternalContext.Account.Details;

            details.ContactInfo.Email.Address = request.Email.Address;
            var success = await accountService.SetAccountDetails(details, coaSessionHelper.InternalContext.Account.SystemOfRecord, coaSessionHelper.InternalContext.Account.AccountNumber);

            return new UpdateEmailResponse
            {
                Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("Create Account - Step 1a")),
                Success = success
            };
        }

        [HttpPost]
        public async Task<HttpResponseMessage> CreateLogin(CreateLoginRequest request)
        {
            coaSessionHelper.StateMachine.Context.Username = domain.AccountPrefix + request.Username;
            coaSessionHelper.StateMachine.Context.Password = request.Password;
            coaSessionHelper.StateMachine.Context.ConfirmPassword = request.ConfirmPassword;
            coaSessionHelper.StateMachine.Context.Challenges = request.Challenges.ToDictionary(c => c.SelectedQuestion.Id, c => c.Answer);

            if (coaSessionHelper.StateMachine.State == typeof(AccountInformationState) || coaSessionHelper.StateMachine.State == typeof(CreateAccountState))
                await coaSessionHelper.StateMachine.Process();

            var success = coaSessionHelper.StateMachine.State == typeof(CompleteState);

            var response = Request.CreateResponse(new CreateLoginResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(coaSessionHelper.StateMachine.ValidationResults, GetAuthItem("Create Account - Step 2"))
            });

            if (success)
            {
                AddAuthenticationCookie(response, request.Username);
            }

            return response;
        }

        #endregion

        #region Reset Password

        [HttpPost]
        public async Task<GetUserChallengeQuestionsResponse> GetUserChallengeQuestions(GetUserChallengeQuestionsRequest request)
        {
            resetPasswordSessionHelper.Reset();
            await resetPasswordSessionHelper.EnsureInitialized();

            resetPasswordSessionHelper.Context.DomainPrefix = domain.AccountPrefix;
            resetPasswordSessionHelper.Context.Username = request.Username;

            await resetPasswordSessionHelper.StateMachine.Process(typeof(VerifyUserState));
            var profile = UserProfile.Locate(container, resetPasswordSessionHelper.Context.DomainPrefix + resetPasswordSessionHelper.Context.Username);

            
            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (resetPasswordSessionHelper.StateMachine.State == typeof(GetUsernameState))
                validations = resetPasswordSessionHelper.StateMachine.ValidationResults;

            if (validations.Any())
            {
                return new GetUserChallengeQuestionsResponse
                {
                    Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Forgot Password"))
                };
            }

            var customer = await accountService.GetCustomerByCustomerId(profile.GlobalCustomerId);

            return new GetUserChallengeQuestionsResponse
            {
                Username = request.Username,
                Email = customer.EmailAddress == null ? null : Redact(customer.EmailAddress),
                SecurityQuestions = from challenge in resetPasswordSessionHelper.Context.Answers ?? new Dictionary<Guid, string>()
                                    let questionItem = database.GetItem(new Sitecore.Data.ID(challenge.Key))
                                    select new SecurityQuestion
                                    {
                                        Id = challenge.Key,
                                        Text = questionItem != null ? questionItem["Question"] : ""
                                    },
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Forgot Password"))
            };
        }

        private string Redact(string email)
        {
            return System.Text.RegularExpressions.Regex.Replace(email ?? "", "^(..?)[^@]*@(.*)$", "$1******@$2");
        }

        [HttpPost]
        public async Task<VerifyUserChallengeQuestionsResponse> VerifyUserChallengeQuestions(VerifyUserChallengeQuestionsRequest request)
        {
            Sitecore.Context.Database = database;
            resetPasswordSessionHelper.Context.Answers = request.Answers.ToDictionary(a => a.Key, a => a.Value);
            resetPasswordSessionHelper.Context.SendEmail = false;

            if (resetPasswordSessionHelper.StateMachine.State == typeof(VerifyUserState))
                await resetPasswordSessionHelper.StateMachine.Process();

            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (coaSessionHelper.StateMachine.State == typeof(VerifyUserState))
                validations = coaSessionHelper.StateMachine.ValidationResults;

            return new VerifyUserChallengeQuestionsResponse
            {
                // TODO - pull from Stream Connect
                AccountName = "Account Name",
                Success = resetPasswordSessionHelper.StateMachine.State == typeof(VerifiedChallengeQuestionsState),
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Forgot Password"))
            };
        }

        [HttpPost]
        public async Task<SendResetPasswordEmailResponse> SendResetPasswordEmail(SendResetPasswordEmailRequest request)
        {
            Sitecore.Context.Database = database;
            resetPasswordSessionHelper.Context.SendEmail = true;

            if (resetPasswordSessionHelper.StateMachine.State == typeof(VerifyUserState))
                await resetPasswordSessionHelper.StateMachine.Process();

            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (coaSessionHelper.StateMachine.State == typeof(VerifyUserState))
                validations = coaSessionHelper.StateMachine.ValidationResults;
                
            return new SendResetPasswordEmailResponse
            {
                Success = resetPasswordSessionHelper.StateMachine.State == typeof(SentEmailState),
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Forgot Password"))
            };
        }

        [HttpPost]
        public ChangePasswordResponse ChangePassword(ChangePasswordRequest request)
        {
            bool success = false;
            if (ModelState.IsValid)
            {
                bool isValid = false;
                string username;

                if (resetPasswordSessionHelper.StateMachine.State == typeof(VerifiedChallengeQuestionsState))
                {
                    username = resetPasswordSessionHelper.Context.Username;
                    isValid = true;
                    resetPasswordSessionHelper.Reset();
                }
                else if (resetPasswordTokenManager.VerifyAndClearPasswordResetToken(request.ResetToken, out username))
                {
                    isValid = true;
                }

                if (isValid)
                {
                    var user = Membership.GetUser(domain.AccountPrefix + username);
                    user.UnlockUser();
                    user.ChangePassword(user.ResetPassword(), request.Password);

                    var profile = profileLocator.Locate(domain.AccountPrefix + username);
                    profile.ImportSource = null;
                    profile.Save();

                    success = true;
                }
            }
            return new ChangePasswordResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("Change Password"))
            };
        }

        #endregion

        #region Recover Username

        [HttpPost]
        public async Task<RecoverUsernameResponse> RecoverUsername(RecoverUsernameRequest request)
        {
            Sitecore.Context.Database = database;
            var success = false;
            if (ModelState.IsValid)
            {
                var customers = await accountService.FindCustomers(request.Email.Address);

                if (customers != null)
                {
                    var usernames = (from customer in customers
                                     where !string.IsNullOrEmpty(customer.Username)
                                     where customer.Username.StartsWith(domain.AccountPrefix)
                                     let username = customer.Username.Substring(domain.AccountPrefix.Length)
                                     orderby username
                                     select username).ToArray();
                    
                    if (usernames.Length > 0)
                    {
                        success = await emailService.SendEmail(new Guid("{126E9D71-C90B-4D06-AEE8-979F92BC772C}"), request.Email.Address, new NameValueCollection() {
                            {"usernames", string.Join(", ", usernames)}
                        });
                    }
                }
            }
            return new RecoverUsernameResponse
            {
                Email = request.Email,
                Success = success,
                Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("Forgot Username"))
            };
        }
        
        #endregion

        #region Change Username

        public bool ChangeUsername(string oldUsername, string newUsername)
        {
            string ConnectionString = Sitecore.Configuration.Settings.GetConnectionString("core");

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText = "UPDATE aspnet_Users SET UserName=@NewUsername,LoweredUserName=@LoweredNewUsername WHERE UserName=@OldUsername";

                    SqlParameter parameter = new SqlParameter("@OldUsername", SqlDbType.VarChar);
                    parameter.Value = oldUsername;
                    command.Parameters.Add(parameter);

                    parameter = new SqlParameter("@NewUsername", SqlDbType.VarChar);
                    parameter.Value = newUsername;
                    command.Parameters.Add(parameter);

                    parameter = new SqlParameter("@LoweredNewUsername", SqlDbType.VarChar);
                    parameter.Value = newUsername.ToLower();
                    command.Parameters.Add(parameter);

                    return command.ExecuteNonQuery() > 0;
                }
            }
        }

        #endregion

        #region Impersonation

        [HttpGet]
        public async Task<HttpResponseMessage> Impersonate(string accountNumber, string expiry, string token, string username = null, string agentId = "CSR User")
        {
            if (!impersonation.Verify(accountNumber, expiry, token))
            {
                var response = Request.CreateResponse(HttpStatusCode.Moved);
                response.Headers.Location = new Uri("/auth/login?error=true&type=impersonate", UriKind.Relative);
                return response;
            }

            var customers = await accountService.FindCustomersByCisAccount(accountNumber);
            if (customers == null || !customers.Any())
            {
                var details = await accountService.GetAccountDetails(accountNumber);
                if (details == null)
                {
                    var response = Request.CreateResponse(HttpStatusCode.Moved);
                    response.Headers.Location = new Uri("/auth/login?error=true&type=impersonate", UriKind.Relative);
                    return response;
                }
                var customer = await accountService.CreateStreamConnectCustomer(email: details.Details.ContactInfo.Email.Address);
                await accountService.AssociateAccount(customer.GlobalCustomerId, accountNumber, null, "");

                customers = new[] { customer };
            }
            else
            {
                var userCustomers = customers.Where(c => c.Username != null);
                if (userCustomers.Any())
                {
                    if (userCustomers.Skip(1).Any())
                    {
                        if (username == null)
                        {
                            var response = Request.CreateResponse(HttpStatusCode.Moved);
                            response.Headers.Location = new Uri("/auth/impersonate?" + HttpContext.Current.Request.QueryString.ToString(), UriKind.Relative);
                            return response;
                        }
                        else
                        {
                            userCustomers = customers.Where(c => c.Username == domain.AccountPrefix + username);
                        }
                    }
                    customers = userCustomers;
                }
            }
            {
                var customer = customers.First();
                var response = Request.CreateResponse(HttpStatusCode.Moved);
                response.Headers.Location = new Uri("/account", UriKind.Relative);
                await logger.Record("Impersonating as " + agentId, Severity.Debug);
                if (string.IsNullOrEmpty(customer.Username))
                    response.Headers.AddCookies(new[] { await impersonation.CreateAuthenticationCookie(customer.GlobalCustomerId) });
                else
                    response.Headers.AddCookies(new[] { await impersonation.CreateAuthenticationCookie(customer.Username) });

                return response;
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> ImpersonateUserList(string accountNumber, string expiry, string token)
        {
            if (!impersonation.Verify(accountNumber, expiry, token))
            {
                return NotFound();
            }

            var customers = await accountService.FindCustomersByCisAccount(accountNumber);
            customers = customers.Where(c => c.Username != null && c.Username.StartsWith(domain.AccountPrefix));

            return Ok(from customer in customers
                      select customer.Username.Substring(domain.AccountPrefix.Length));
        }

        #endregion

        private Sitecore.Data.Items.Item GetAuthItem(string childItem)
        {
            return item.Children[childItem];
        }

        private void AddRememberMeCookie(HttpResponseMessage response, string username)
        {
            response.Headers.AddCookies(new[] {
                    new System.Net.Http.Headers.CookieHeaderValue("username", username) 
                    { 
                        Expires = DateTime.Now.AddYears(1), 
                        HttpOnly = true, 
                        Path = "/", 
                        Secure = false 
                    }
                });
        }

        private void RemoveRememberMeCookie(HttpResponseMessage response)
        {
            response.Headers.AddCookies(new[] {
                    new System.Net.Http.Headers.CookieHeaderValue("username", "") 
                    { 
                        Expires = DateTime.Now, 
                        HttpOnly = true, 
                        Path = "/", 
                        Secure = false 
                    }
                });
        }

        public void AddAuthenticationCookie(HttpResponseMessage response, string username)
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

        [HttpGet]
        public async Task<FindAccountForImpersonation> LookUpAccount(string accountNumber)
        {
            var impAccount = new FindAccountForImpersonation();

            var accessgroup = settings.GetSettingsValue("Impersonation", "Access Group");

            if (!Sitecore.Context.User.IsInRole(accessgroup))
                impAccount.HasAccess = false;
            else
            {
                impAccount.HasAccess = true;
                var account = await accountService.GetAccountDetails(accountNumber);
                if (account == null)
                {
                    impAccount.IsError = true;
                    return impAccount;
                }


                var sharedSecret = settings.GetSettingsValue("Impersonation", "Impersonation Shared Secret");
                var host = settings.GetSettingsValue("Impersonation", "Domain");
                var expiry = System.Xml.XmlConvert.ToString(DateTime.Now.AddMinutes(30), System.Xml.XmlDateTimeSerializationMode.Local);
                var unencryptedToken = string.Format("{0}{1}{2}", accountNumber, expiry, sharedSecret);
                var token = Convert.ToBase64String(System.Security.Cryptography.MD5.Create().ComputeHash(Encoding.ASCII.GetBytes(unencryptedToken)));

                impAccount.CustomerName = account.Details.ContactInfo.Name;
                impAccount.Phone = account.Details.ContactInfo.Phone;
                impAccount.Email = account.Details.ContactInfo.Email;
                impAccount.BillingAddress = account.Details.BillingAddress;
                impAccount.CustomerType = account.AccountType;
                impAccount.AccountNumber = account.AccountNumber;
                impAccount.Balance = account.Balance.Balance;
                impAccount.Ssn = account.Details.SsnLastFour;
                impAccount.IsError = false;
                impAccount.ImpersonateUrl = host + string.Format("/api/authentication/impersonate?accountNumber={0}&expiry={1}&token={2}", accountNumber, HttpUtility.UrlEncode(expiry), HttpUtility.UrlEncode(token));
            }

            return impAccount;
        }

    }
}
