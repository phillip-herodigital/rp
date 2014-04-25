define(function() {
  var chartPalette = {
    // fixed facets colors
    cVa: "#ffe175",   // Value
    cVi: "#82ac6c",   // Visits
    cVPV: "#b0cfe8",  // Value per Visit
    cAF: "#a6a6a6",   // All facets
    cOF: "#e3e3e3",   // Other facets
    
    // standardColors: used in all charts, based on Harvard theme DataPalette
    standardColors: ["#76abd6", "#d5c576", "#ff8e4d", "#b09ba5", "#ffd84d", "#9dbf8d", "#d9b073", "#ea7861", "#d4e4f2", "#f2edd4", "#ffdbc7", "#e6e0e3", "#fff3c7", "#e0ebdb", "#f3e6d3", "#f9d5cd", "#4e92ca", "#c9b54f", "#ff6e1a", "#9a7e8c", "#ffcd1a", "#82ac6c", "#ce994b", "#e55134"],

    // comparisonColors: used in Maps, from green to red
    comparisonColors: [
      "#689353", 
      "#82AC6C", 
      "#90B67C", 
      "#9EBF8D", 
      "#B4CDA7",
      "#C8DBBE",
      "#F4B4A4", 
      "#F09A84", 
      "#EB7C60", 
      "#E96949", 
      "#E65733", 
      "#E5532E"    
    ]      
  };

  return chartPalette;
});