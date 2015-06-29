define([], function () {
  return {
    areEqual: function(id1, id2) {
      var parsedId1 = id1.replace(/{|}|-/g, '').toUpperCase();
      var parsedId2 = id1.replace(/{|}|-/g, '').toUpperCase();
      return parsedId1 == parsedId2;
    }
  }
});