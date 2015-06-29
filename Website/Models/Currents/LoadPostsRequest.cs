using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class LoadPostsRequest
    {
        public string currentItemId { get; set; }
        public string categoryID { get; set; }
        public string authorID { get; set; }
        public string tagID { get; set; }
        public string searchText { get; set; }
        public int startRowIndex { get; set; }
        public int maximumRows { get; set; }
        public string language { get; set; }
    }
}