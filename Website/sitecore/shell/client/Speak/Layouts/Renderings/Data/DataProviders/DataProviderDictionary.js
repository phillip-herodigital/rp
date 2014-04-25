define(["sitecore"], function () {
  var chartDictionary = {},
    databaseUri = new Sitecore.Definitions.Data.DatabaseUri("core"),
    database = new Sitecore.Definitions.Data.Database(databaseUri),
    addToDictionary = function (item) {
      chartDictionary[item.itemName] = item.Text;
    };
  
  // "Server returned"
  database.getItem("{884B9AA5-E7A8-457C-B251-8AEA1802D082}", addToDictionary);
  
  // "GetData is not overridden"
  database.getItem("{85BEED73-6264-45DB-ACE5-C40957631528}", addToDictionary);
  
  // "SuccessHandler is not overridden"
  database.getItem("{B8C9D7C5-27C7-4FCC-BCD1-87CB99E3B23E}", addToDictionary);

  return chartDictionary;
});