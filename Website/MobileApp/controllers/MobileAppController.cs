using StreamEnergy.MyStream.MobileApp.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.SessionState;

namespace StreamEnergy.MyStream.MobileApp.controllers
{
    public class MobileAppController : ApiController, IRequiresSessionState
    {
        [HttpGet]
        public async Task<MobileAppResponse> LoadAppData()
        {
            if (Sitecore.Context.User == null)
                return null;

            return new MobileAppResponse
            {
                User = new MobileAppUser {
                    Name = Sitecore.Context.User.LocalName,
                    UserName = Sitecore.Context.GetUserName()
                }
            };
        }
    }
}
