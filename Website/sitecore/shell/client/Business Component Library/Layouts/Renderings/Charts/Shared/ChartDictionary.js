define(["sitecore"], function () {
  var chartDictionary = {},
    databaseUri = new Sitecore.Definitions.Data.DatabaseUri("core"),
    database = new Sitecore.Definitions.Data.Database(databaseUri),
    addToDictionary = function (item) {
      chartDictionary[item.itemName] = item.Text;
    };

  // "No data to display"
  database.getItem("{3D4D2B4A-6618-48F9-B6C7-1555576F52D9}", addToDictionary);
  
  // "GetChartComponentName is not overriden"
  database.getItem("{DA5A50F6-B5B0-4099-B60C-AC53E6A49235}", addToDictionary);
  
  // "CategoryChartField not defined"
  database.getItem("{C4255798-67A7-4A8A-AB4F-B40F4F5E5B54}", addToDictionary);
  
  // "ValueChartFields not defined"
  database.getItem("{04EF30C1-FD45-41C3-8132-DDBC348D4142}", addToDictionary);
  
  // "CategoryChartField not found"
  database.getItem("{6CBCF84A-67F0-4B3E-A27B-C02750D614AA}", addToDictionary);
  
  // "SeriesChartField not found"
  database.getItem("{A7C682ED-B376-4291-B379-9D1B82D641CD}", addToDictionary);
  
  // "No categories found"
  database.getItem("{AAAD44C8-9ACC-4E65-B3C4-986924CA3AE9}", addToDictionary);
  
  // "ValueChartField not found"
  database.getItem("{A58F868C-AF32-4AA0-B3AF-66CFFEE78640}", addToDictionary);
  
  // "DataField not found"
  database.getItem("{25F313F1-CADB-4F1A-893D-68D79CDF70EE}", addToDictionary);
  
  return chartDictionary;
});