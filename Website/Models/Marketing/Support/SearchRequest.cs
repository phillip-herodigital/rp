﻿namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class SearchRequest
    {
        public string Query { get; set; }
        public string Category { get; set; }
        public string State { get; set; }
        public string Subcategory { get; set; }
        public string Keyword { get; set; }
        public int StartRowIndex { get; set; }
        public int MaximumRows { get; set; }
    }
}