document.observe("dom:loaded", function() {
  var data = window.componentsData;
  var selectedCombination = {};
  for(var n in data) {
    if (!data.hasOwnProperty(n)) {
      continue;
    }

    if (data[n] && data[n].length) {
      var maxValue = -1;
      var bestVariation = data[n][0];
      data[n].each(function(v) {
        if (v.value > maxValue) {
          maxValue = v.value;
          bestVariation = v;
        }        
      });
            
      selectedCombination[n] = bestVariation.id;
    } 
  }

  scSetCurrentCombination(selectedCombination);
  var element = $$(".testing-components")[0];     
  window.componentsGrid = new scTestingComponentsGrid(element, {data : data, onVariationChange: scVariationChanged, isTestRunning: true});
  window.componentsGrid.setSelectedCombination(selectedCombination);  
});

function scVariationChanged(evt, variationId, componentId) {
  var value = scGetCurrentCombination();
  value[componentId] = variationId;
  scSetCurrentCombination(value);
};

function scGetCurrentCombination() {
  var selectedcombination = $("selectedcombination");
  var value = selectedcombination.value;
  if (!value) {
    value = {};
  }
  else {
    value = value.evalJSON();
  }

  return value;
};

function scSetCurrentCombination(combination) {
  var selectedcombination = $("selectedcombination");
  if (selectedcombination && combination) {
    selectedcombination.value = Object.toJSON(combination);
  }
};


function scLoadCombinations() {    
  var url = "/sitecore/shell/Applications/WebEdit/TestCombinations.ashx?";
  var params = window.location.search.toQueryParams();
  url += "itemID=" + params.itemId.replace(/-|{|}/g ,"");
  url += "&deviceID=" +  params.device.replace(/-|{|}/g ,"");
  url += "&lang=" + params.contentlang;
  url += "&stat=1";
  url += "&r=" + Math.random();   
  
  var combinationsContainer = $("Combinations");
  new Ajax.Request(url, {
  method: "GET", 
  onSuccess: function(transport) {
    var response = transport.responseJSON;
    var headers = ["#"];
    response.components.each(function(c) {
      headers.push(c.name);
    });
        
    headers.push(scTranslations.Value);    
    var options = {      
      headers: headers,
      components: response.components,
      combinations: response.combinations,      
      id: "combinationsGrid",
      onCombinationChange: window.scOnCombinationChange,
      showValue: true 
    };
   
    combinationsContainer.removeClassName("scWait");
    window.combinationsGrid = new Sitecore.CombinationsGrid(combinationsContainer, options);    
    var combination = scGetCurrentCombination();
    if (combination) {
      window.combinationsGrid.setSelectedCombination(combination);
    }
            
    sorting = [[headers.length -1, 1]];
    jQuery("#combinationsGrid").tablesorter({ sortList: sorting, widgets: ["zebra"] });  
  },

  onFailure: function() {
   combinationsContainer.removeClassName("scWait");
   combinationsContainer.innerHTML = "<div style='padding:8px; text-align:center;'>" + scTranslations.ErrorOcurred + "</div>";
  }
 });
};

function scOnCombinationChange(evt, combination) {
  evt.stop();
  scSetCurrentCombination(combination);  
};

function scTabChanged(tabIndex) {
  var combination = null;
  if (scForm.browser.initializeFixsizeElements) {
     scForm.browser.initializeFixsizeElements();
  }

  var combination = scGetCurrentCombination();
  if (tabIndex == 1) {
    if (window.combinationsGrid == null) {      
      scLoadCombinations();
      return;
    }
    
    if (combination) {
      window.combinationsGrid.setSelectedCombination(combination);
    }

    return;
  }
    
  if (combination) {
    window.componentsGrid.setSelectedCombination(combination);
  }
};

