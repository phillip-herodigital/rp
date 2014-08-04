﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Logging
{
    class HttpDataAccumulator : IDataAccumulator
    {
        private readonly IUnityContainer unityContainer;

        public HttpDataAccumulator(IUnityContainer unityContainer)
        {
            this.unityContainer = unityContainer;
        }

        Task IDataAccumulator.AccumulateData(LogEntry logEntry)
        {
            try
            {
                var context = unityContainer.Resolve<HttpContextBase>();
                if (context.Session != null)
                {
                    logEntry.Data["SessionId"] = context.Session.SessionID;
                    logEntry.Data["User"] = context.User.Identity.Name;
                }
                logEntry.Data["Request"] = new
                {
                    Url = context.Request.Url,
                    Headers = context.Request.Headers.AllKeys.Except(new[] { "Cookie" }).ToDictionary(key => key, key => context.Request.Headers.GetValues(key)),
                    Cookies = (from cookieKey in context.Request.Cookies.AllKeys
                               let cookie = context.Request.Cookies.Get(cookieKey)
                               select new { Key = cookieKey, Value = cookie.Value }).ToArray(),
                };

            }
            catch 
            {
            }
            return Task.FromResult<object>(null);
        }
    }
}
