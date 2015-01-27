using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class ValidasRequest
    {
        public string username { get; set; }
        public string password { get; set; }
        public string securityAnswer { get; set; }
        public string carrier { get; set; }
    }
}