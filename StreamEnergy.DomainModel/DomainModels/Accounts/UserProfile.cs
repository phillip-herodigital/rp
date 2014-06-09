using System;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Profile;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Accounts
{
    public class UserProfile
    {
        private ProfileBase profile;

        public UserProfile(string username)
        {
            // Yep, this says Create. That's how ASP.Net "locates" the user profile.
            profile = ProfileBase.Create(username);
        }

        public ChallengeResponse[] ChallengeQuestions 
        {
            get { return (ChallengeResponse[])profile.GetPropertyValue("ChallengeQuestions"); }
            set { profile.SetPropertyValue("ChallengeQuestions", value); }
        }

        public void Save()
        {
            profile.Save();
        }
        
        

        public static UserProfile Locate(IUnityContainer container, string username)
        {
            return container.Resolve<UserProfile>(new ParameterOverride("username", username));
        }
    }
}
