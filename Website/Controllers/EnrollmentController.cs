using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
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
        private static readonly string StateSessionKey = typeof(EnrollmentController).FullName + " State";
        private HttpSessionStateBase session;
        private IStateMachine<UserContext, InternalContext> stateMachine;

        public EnrollmentController(HttpSessionStateBase session, StateMachine<UserContext, InternalContext> stateMachine)
        {
            this.session = session;
            this.stateMachine = stateMachine;
        }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            var context = session[ContextSessionKey] as UserContext;
            if (context == null)
                session[ContextSessionKey] = context = new UserContext();

            var state = (session[StateSessionKey] as Type) ?? typeof(DomainModels.Enrollments.GetServiceInformationState);
            stateMachine.Initialize(state, context, null);

            base.Initialize(controllerContext);
        }

        protected override void Dispose(bool disposing)
        {
            session[ContextSessionKey] = stateMachine.Context;
            session[StateSessionKey] = stateMachine.State;

            base.Dispose(disposing);
        }

        [HttpGet]
        public Address ServiceAddress()
        {
            return stateMachine.Context.ServiceAddress;
        }

        [HttpPost]
        public IEnumerable<ValidationResult> ServiceAddress([FromBody]Address value)
        {
            stateMachine.Context.ServiceAddress = value;
            return stateMachine.ValidationResults;
        }
    }
}