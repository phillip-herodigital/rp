using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Enrollment;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.SessionState;

namespace StreamEnergy.MyStream.Controllers
{
    public class EnrollmentController : ApiController, IRequiresSessionState
    {
        private static readonly string ContextSessionKey = typeof(EnrollmentController).FullName + " " + typeof(UserContext).FullName;
        private static readonly string InternalContextSessionKey = typeof(EnrollmentController).FullName + " " + typeof(InternalContext).FullName;
        private static readonly string StateSessionKey = typeof(EnrollmentController).FullName + " State";
        private readonly Sitecore.Data.Items.Item translationItem;
        private HttpSessionStateBase session;
        private IStateMachine<UserContext, InternalContext> stateMachine;

        public EnrollmentController(HttpSessionStateBase session, StateMachine<UserContext, InternalContext> stateMachine)
        {
            this.translationItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{5B9C5629-3350-4D85-AACB-277835B6B1C9}"));
            this.session = session;
            this.stateMachine = stateMachine;
        }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            var context = session[ContextSessionKey] as UserContext;
            if (context == null)
                session[ContextSessionKey] = context = new UserContext();

            var state = (session[StateSessionKey] as Type) ?? typeof(DomainModels.Enrollments.ServiceInformationState);
            stateMachine.Initialize(state, context, session[InternalContextSessionKey] as InternalContext);

            base.Initialize(controllerContext);
        }

        protected override void Dispose(bool disposing)
        {
            if (stateMachine != null)
            {
                session[ContextSessionKey] = stateMachine.Context;
                session[StateSessionKey] = stateMachine.State;
                session[InternalContextSessionKey] = stateMachine.InternalContext;
            }
            else
            {
                session[ContextSessionKey] = null;
                session[StateSessionKey] = null;
                session[InternalContextSessionKey] = null;
            }

            base.Dispose(disposing);
        }

        [HttpPost]
        public void Reset()
        {
            stateMachine = null;
        }

        /// <summary>
        /// Gets all the client data, such as for a page refresh
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ClientData ClientData()
        {
            return new ClientData
            {
                Validations = TranslatedValidationResult.Translate(stateMachine.ValidationResults, translationItem),
                UserContext = CopyForClientDisplay(stateMachine.Context),
                // TODO - more data, such as plan list, calendar, etc. - probably from stateMachine.InternalContext
            };
        }

        [HttpGet]
        public ServiceInformation ServiceInformation()
        {
            return new ServiceInformation
            {
                ServiceAddress = stateMachine.Context.ServiceAddress,
                ServiceCapabilities = stateMachine.Context.ServiceCapabilities,
                IsNewService = stateMachine.Context.IsNewService
            };
        }

        [HttpPost]
        public ClientData ServiceInformation([FromBody]ServiceInformation value)
        {
            stateMachine.Context.ServiceAddress = value.ServiceAddress;
            stateMachine.Context.ServiceCapabilities = value.ServiceCapabilities;
            stateMachine.Context.IsNewService = value.IsNewService;
            
            stateMachine.Process(); // TODO - set steps to stop at
            
            return ClientData();
        }

        [HttpPost]
        public ClientData SelectedOffers()
        {
            // TODO - need some parameters

            stateMachine.Process(); // TODO - set steps to stop at

            return ClientData();
        }

        private UserContext CopyForClientDisplay(UserContext userContext)
        {
            // TODO - clone and remove items that should not be displayed
            return userContext;
        }
    }
}