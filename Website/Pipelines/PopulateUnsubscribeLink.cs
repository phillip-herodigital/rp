using Sitecore.Diagnostics;
using Sitecore.Modules.EmailCampaign.Core.Pipelines;
using Sitecore.Modules.EmailCampaign.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace StreamEnergy.MyStream.Pipelines
{
    public class PopulateUnsubscribeLink
    {
        static string GetMd5Hash(MD5 md5Hash, string input)
        {

            // Convert the input string to a byte array and compute the hash. 
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes 
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data  
            // and format each one as a hexadecimal string. 
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string. 
            return sBuilder.ToString();
        }
        
        public void Process(SendMessageArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            MailMessageItem message = args.EcmMessage as MailMessageItem;

            if (message != null)
            {
                if (!String.IsNullOrEmpty(message.Body))
                {
                    string token = "**HASHED_EMAIL**";
                    MD5 md5Hash = MD5.Create();
                    string hash = GetMd5Hash(md5Hash, message.To);
                    args.EcmMessage.Body = message.Body.Replace(token, hash);
                }
            }
        }
    }
}