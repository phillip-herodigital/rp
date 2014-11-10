using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    public class Cryptography
    {
        #region Settings

        private static readonly int iterations = 2;
        private static readonly int keySize = 128;

        private static readonly string hash = "SHA1";
        private readonly string salt;
        private readonly string vector;

        #endregion

        public Cryptography(string salt, string vector)
        {
            this.salt = salt;
            this.vector = vector;
        }

        public string Encrypt(string value, string password)
        {
            byte[] vectorBytes = Encoding.ASCII.GetBytes(vector);
            byte[] saltBytes = Encoding.ASCII.GetBytes(salt);
            byte[] valueBytes = Encoding.UTF8.GetBytes(value);

            byte[] encrypted;
            using (AesManaged cipher = new AesManaged())
            {
                PasswordDeriveBytes _passwordBytes =
                    new PasswordDeriveBytes(password, saltBytes, hash, iterations);
                byte[] keyBytes = _passwordBytes.GetBytes(keySize / 8);

                cipher.Mode = CipherMode.CBC;

                using (ICryptoTransform encryptor = cipher.CreateEncryptor(keyBytes, vectorBytes))
                {
                    using (MemoryStream to = new MemoryStream())
                    {
                        using (CryptoStream writer = new CryptoStream(to, encryptor, CryptoStreamMode.Write))
                        {
                            writer.Write(valueBytes, 0, valueBytes.Length);
                            writer.FlushFinalBlock();
                            encrypted = to.ToArray();
                        }
                    }
                }
                cipher.Clear();
            }
            return Convert.ToBase64String(encrypted);
        }

        public string Decrypt(string value, string password)
        {
            byte[] vectorBytes = ASCIIEncoding.ASCII.GetBytes(vector);
            byte[] saltBytes = ASCIIEncoding.ASCII.GetBytes(salt);
            byte[] valueBytes = Convert.FromBase64String(value);

            byte[] decrypted;
            int decryptedByteCount = 0;

            using (AesManaged cipher = new AesManaged())
            {
                PasswordDeriveBytes _passwordBytes = new PasswordDeriveBytes(password, saltBytes, hash, iterations);
                byte[] keyBytes = _passwordBytes.GetBytes(keySize / 8);

                cipher.Mode = CipherMode.CBC;

                try
                {
                    using (ICryptoTransform decryptor = cipher.CreateDecryptor(keyBytes, vectorBytes))
                    {
                        using (MemoryStream from = new MemoryStream(valueBytes))
                        {
                            using (CryptoStream reader = new CryptoStream(from, decryptor, CryptoStreamMode.Read))
                            {
                                decrypted = new byte[valueBytes.Length];
                                decryptedByteCount = reader.Read(decrypted, 0, decrypted.Length);
                            }
                        }
                    }
                }
                catch (Exception)
                {
                    return String.Empty;
                }

                cipher.Clear();
            }
            return Encoding.UTF8.GetString(decrypted, 0, decryptedByteCount);
        }

    }
}
