using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace StreamEnergy.MyStream.Conditions
{

    static class Cryptography
    {
        #region Settings

        private static string _salt = "8f9huif345utnfkj"; // Random
        private static string _vector = "542jknvzx654fjks"; // Random

        private static readonly StreamEnergy.Cryptography cryptography = new StreamEnergy.Cryptography(_salt, _vector);

        #endregion

        public static string Encrypt(string value, string password)
        {
            return cryptography.Encrypt(value, password);
        }

        public static string Decrypt(string value, string password)
        {
            return cryptography.Decrypt(value, password);
        }

    }
}