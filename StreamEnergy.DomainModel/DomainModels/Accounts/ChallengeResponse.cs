using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class ChallengeResponse
    {
        public Guid QuestionKey { get; set; }
        public string ResponseSalt { get; set; }
        public string ResponseHash { get; set; }

        public bool IsCorrect(string answer)
        {
            return ResponseHash == EncryptResponse(answer, ResponseSalt);
        }

        public static ChallengeResponse Create(Guid questionKey, string answer)
        {
            var salt = GenerateSalt();
            return new ChallengeResponse
            {
                QuestionKey = questionKey,
                ResponseSalt = salt,
                ResponseHash = EncryptResponse(answer, salt)
            };
        }

        private static string EncryptResponse(string answer, string salt)
        {
            var sanitizedAnswer = (answer ?? "").Trim().ToLower();

            byte[] bytes = Encoding.Unicode.GetBytes(sanitizedAnswer);
            byte[] saltBytes = Convert.FromBase64String(salt);
            byte[] inArray;
            HashAlgorithm hashAlgorithm = HashAlgorithm.Create("SHA1");
            byte[] hashed = new byte[saltBytes.Length + bytes.Length];

            Buffer.BlockCopy(saltBytes, 0, hashed, 0, saltBytes.Length);
            Buffer.BlockCopy(bytes, 0, hashed, saltBytes.Length, bytes.Length);
            inArray = hashAlgorithm.ComputeHash(hashed);

            return Convert.ToBase64String(inArray);
        }

        private static string GenerateSalt()
        {
            byte[] array = new byte[16];
            new RNGCryptoServiceProvider().GetBytes(array);
            return Convert.ToBase64String(array);
        }
    }
}
