define(["sitecore"],
  function (sitecore) {
    return {
      setNearestTimeInComboBox: function (dataSource, comboBoxObj) {
        if (dataSource.get("selectedItem").id) {
          var daysSeconds = 24 * 60 * 60;
          var dcList = dataSource.get("comboBoxList");
          var selectedItem = null;

          var selectedValue = dataSource.get("selectedItem").id - new Date().getTimezoneOffset() * 60;

          if (selectedValue > daysSeconds) {
            selectedValue = selectedValue - daysSeconds;
          }
          _.each(dcList, function (item) {
            if (item.id === selectedValue.toString()) {
              selectedItem = item;
            }
          });

          comboBoxObj.set("selectedItem", selectedItem);
        }
      }
    };
  });