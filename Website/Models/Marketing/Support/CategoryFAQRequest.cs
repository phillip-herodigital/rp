namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class CategoryFAQRequest
    {
        public string CategoryGuid { get; set; }
        public int StartRowIndex { get; set; }
        public int MaximumRows { get; set; }
    }
}