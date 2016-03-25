using System;
using System.Collections.Specialized;

namespace StreamEnergy.MyStream.Pipelines
{
    public class SetSponsorCookie : Sitecore.Pipelines.HttpRequest.HttpRequestProcessor
    {
        public override void Process(Sitecore.Pipelines.HttpRequest.HttpRequestArgs args)
        {
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request["SPID"]))
                {
                    bool useRemoteEnrollment;
                    NameValueCollection queryString;
                    Services.Helpers.EnrollmentTrafficCopHelper.HandlePersistence(out useRemoteEnrollment, out queryString);
                }
            }
            catch (Exception) { } // Eat all errors for breakfast
        }
    }
}