using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
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
        private HttpSessionStateBase session;
        private StateMachine<UserContext, object> stateMachine;

        public EnrollmentController(HttpSessionStateBase session, StateMachine<UserContext, object> stateMachine)
        {
            this.session = session;
            this.stateMachine = stateMachine;
        }

        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        [HttpGet]
        public Address Trial()
        {
            return new Address
                {
                     AddressLine1 = "123 Test St",
                     City = "Dallas",
                     StateAbbreviation = "TX",
                     PostalCode5 = "75201",
                };
        }

        [HttpPost]
        public IEnumerable<string> Trial([FromBody]string value)
        {
            return new string[] { "value1", "value2", value };
        }
    }
}