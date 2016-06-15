(function(speak) {
  speak.pageCode([],function() {
    return {       
       initialized: function () {
           self = this;
           serverRequestOptions = {
           parameters: null,
           onSuccess: this.dataLoaded,
           url: this.GenericDataSourceBook.ServiceUrl
         };
       },

      dataLoaded: function(data) {           
        self.AuthorText.Text = data[0].Author;
        self.TitleText.Text = data[0].Title;
        self.AuthorText1.Text = data[1].Author;
        self.TitleText1.Text = data[1].Title;
      },

      loadData: function() {
        this.GenericDataSourceBook.loadData(serverRequestOptions);
      },

      complexDataLoaded: function (data) {
        self.ComplexDataLabelText.Text = JSON.stringify(self.GenericDataSourceComplex.DynamicData);
      },

      loadComplexData: function () {
        var custom = {
          "addData": {
            "field": "recency",
            "direction": "asc",
            "custom": {
              "field": "recency",
              "direction": "asc"
            }
          }
        };
        this.GenericDataSourceComplex.loadData({ onSuccess: this.complexDataLoaded, parameters: custom });
      }
    };
  }, "SubAppRenderer");
})(Sitecore.Speak);