using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StackExchange.Redis;

namespace StreamEnergy.DomainModels.Accounts.ResetPassword
{
    public class ResetPasswordTokenManager
    {
        private IDatabase redisDatabase;
        private static readonly TimeSpan timeToLive = TimeSpan.FromHours(48);

        public ResetPasswordTokenManager(IDatabase redisDatabase)
        {
            this.redisDatabase = redisDatabase;
        }

        public bool VerifyPasswordResetToken(string token, string username)
        {
            var key = GetTokenRedisKey(token);
            var retrievedUsername = (string)redisDatabase.StringGet(key);
            return retrievedUsername == username;
        }

        public bool VerifyAndClearPasswordResetToken(string token, out string username)
        {
            var key = GetTokenRedisKey(token);
            username = redisDatabase.StringGet(key);
            redisDatabase.KeyDelete(key);
            return username != null;
        }

        internal string GetPasswordResetToken(string username)
        {
            var token = GeneratetToken();
            redisDatabase.StringSet(GetTokenRedisKey(token), username, timeToLive);
            return token;
        }

        private string GetTokenRedisKey(string token)
        {
            return this.GetType().FullName + " " + token;
        }

        private static string GeneratetToken()
        {
            byte[] array = new byte[8];
            new System.Security.Cryptography.RNGCryptoServiceProvider().GetBytes(array);
            return Convert.ToBase64String(array);
        }
    }
}
