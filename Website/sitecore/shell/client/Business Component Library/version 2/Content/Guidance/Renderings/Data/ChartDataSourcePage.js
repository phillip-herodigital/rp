(function(speak) {
  speak.pageCode([],function() {
    return {       
       initialized: function () {
           self = this;
           serverRequestOptions1 = {
            parameters: null,           
            url: this.ChartDataSource.ServiceUrl
           },
          serverRequestOptions2 = {
            parameters: null,           
            url: this.ChartDataSource.ServiceUrl
          };
       },


      loadData: function() {
        this.ChartDataSource.loadData(serverRequestOptions1);
      },

      loadData2: function() {
        this.ChartDataSource2.loadData(serverRequestOptions2);
      }
    };
  }, "SubAppRenderer");
})(Sitecore.Speak);