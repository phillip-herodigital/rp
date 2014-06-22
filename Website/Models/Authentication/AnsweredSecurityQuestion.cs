using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class AnsweredSecurityQuestion
    {
        public SecurityQuestion SelectedQuestion { get; set; }

        [MinLength(4, ErrorMessage=("Answer Minimum Length Invalid"))]
        public string Answer { get; set; }
    }
}
