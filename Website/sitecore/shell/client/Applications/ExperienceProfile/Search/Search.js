define(["sitecore", "../Common/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil)
{
  var textProperty = "text";
  var cidataProperty = "cidata";
  var isVisibleProperty = "isVisible";
  
  var contactsPath = "/contacts";
  var baseUrl = "/sitecore/api/ao/v1" + contactsPath + "/";

  var getFullName = function(data)
  {
    var fullName = data.firstName;
    if (data.middleName)
    {
      fullName += " " + data.middleName;
    }

    if (data.surName)
    {
      fullName += " " + data.surName;
    }

    return fullName;
  };

  var app = sc.Definitions.App.extend({
    initialized: function()
    {
      this.SearchTextBox.viewModel.$el.keyup($.proxy(function (e)
      {
        if (e.keyCode == 13)
        {
          this.SearchButton.viewModel.click();
        }
      }, this));

      var searchTable = "search";

      providerHelper.setupHeaders([
        { urlKey: contactsPath + "/" + searchTable + "?", headerValue: "default" }
      ]);

      providerHelper.initProvider(this.SearchDataProvider, "ContactSearchResults", baseUrl + searchTable, this.SearchMessageBar);
      providerHelper.subscribeAccordionHeader(this.SearchDataProvider, this.ResultsAccordion);
      providerHelper.setupDataRepeater(this.SearchDataProvider, this.ContactDataRepeater);

      this.ContactDataRepeater.on("subAppLoaded", this.setContactData, this);

      var searchText = decodeURIComponent(cintelUtil.getQueryParam(textProperty));
      if (searchText)
      {
        this.SearchTextBox.set(textProperty, searchText);
        this.findContacts();
      }
      
      this.SearchDataProvider.on("change:" + cidataProperty, function ()
      {
        var data = this.SearchDataProvider.get(cidataProperty);
        var noData = data ? data.length == 0 : true;

        var noRepeaterItems = this.ContactDataRepeater.get("renderedApps").length < 1;
        this.NoSearchResult.set(isVisibleProperty, noData && noRepeaterItems);
      }, this);
    },
    
    findContacts: function()
    {
      var match = this.SearchTextBox.get(textProperty);
      if (!match)
      {
        return;
      }

      if (!this.ResultsBorder.get(isVisibleProperty))
      {
        this.ResultsBorder.viewModel.show();
      }

      this.ContactDataRepeater.viewModel.reset();

      history.pushState(null, null, "search?text=" + encodeURIComponent(this.SearchTextBox.get(textProperty)));

      providerHelper.addQueryParameter(this.SearchDataProvider, "match", encodeURIComponent(this.SearchTextBox.get(textProperty)));
      providerHelper.getListData(this.SearchDataProvider);
    },

    setContactData: function (args)
    {
      var subapp = args.app;
      var data = args.data;
      subapp.contactId = data.contactId;

      subapp.Photo.set("imageUrl", baseUrl + data.contactId + "/image?w=72&h=72");
      subapp.Photo.viewModel.$el.on("click", function () {
        window.location.replace("contact?cid=" + data.contactId);
      });

      subapp.ContactName.set(textProperty, getFullName(data));
      subapp.ContactJob.set(textProperty, data.jobTitle);

      subapp.ContactEmailHyperlink.set(textProperty, data.preferredEmailAddress);
      subapp.ContactEmailHyperlink.viewModel.$el.attr("href", "mailto:" + data.preferredEmailAddress);

      subapp.TotalVisitsValue.set(textProperty, data.visitCount);

      subapp.LatestVisitTime.set(textProperty, data.formattedLatestVisitStartDateTime);

      if (data.recency)
      {
        subapp.LatestVisitRecency.set(textProperty, "(" + data.recency + ")");
      }

      subapp.LatestVisitLocation.set(textProperty, data.latestVisitLocationDisplayName);

      subapp.ValueValue.set(textProperty, data.latestVisitValue);
      subapp.PageViewsValue.set(textProperty, data.latestVisitPageViewCount);
    }
  });
  return app;
});