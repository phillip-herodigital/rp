﻿namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class searchRequest
    {
        public string Query { get; set; }
        public string Category { get; set; }
        public string State { get; set; }
        public string Subcategory { get; set; }
    }
}