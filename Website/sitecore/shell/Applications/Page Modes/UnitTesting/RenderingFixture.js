module("Rendering operations");
test("Add new rendering at frist position",3, function() {  
   var placeholder, callback;
   placeholder = Sitecore.PageModes.ChromeManager.getChrome($sc(Sitecore.UnitTests.Constants.placeholderChromeSelector).eq(0));     
   callback = function() {      
      ok(true);         
      setTimeout(function() {       
        Sitecore.PageModes.ChromeManager.chromeUpdated.stopObserving(callback);
        var rendering = placeholder.type.renderings()[0];
        ok(rendering && rendering.key() == "rendering", "rendering should be inserted");
        same(rendering.type.renderingId(), Sitecore.UnitTests.Constants.sampleRenderingId, "The rendeirng item is wrong");
        start();
      }, 500);            
   };

   Sitecore.PageModes.ChromeManager.chromeUpdated.observe(callback);
   placeholder.type.addControl(0, {controlId: Sitecore.UnitTests.Constants.sampleRenderingId}); 
   stop(1000);     
});

test("Delete rendering", 3, function() {  
  var placeholder, rendering, uid, isRenderingDeleted;
  placeholder = Sitecore.PageModes.ChromeManager.getChrome($sc(Sitecore.UnitTests.Constants.placeholderChromeSelector).eq(0));
  ok(placeholder, "placeholder");
  rendering = placeholder.type.renderings()[0];
  ok(rendering, "There should be >= 1 rendering inside a placeholder'" + placeholder.type.placeholderKey() + "' for performing the test");
  uid = rendering.type.uniqueId();
  rendering.type.deleteControl();
  stop(1000);
  setTimeout(function() {
    isRenderingDeleted = !$sc.first(placeholder.type.renderings(), function() { this.type.uniqueId() == uid; });
    ok(isRenderingDeleted, "The rendering shouldbe deleted");
    start();
  }, 500);
});

test("Add new sublayout at last position", 3, function() {
   var placeholder, callback, position;
   placeholder = Sitecore.PageModes.ChromeManager.getChrome($sc(Sitecore.UnitTests.Constants.placeholderChromeSelector).eq(0));
   position = placeholder.type.renderings().length;     
   callback = function() {      
      ok(true);     
      setTimeout(function() {
        Sitecore.PageModes.ChromeManager.chromeUpdated.stopObserving(callback);
        var rendering = placeholder.type.renderings()[position];
        ok(rendering && rendering.key() == "rendering", "rendering should be inserted");
        if (!rendering) {
          start();
          return;
        }
        same(rendering.type.renderingId(), Sitecore.UnitTests.Constants.sampleSublayoutId, "The rendering item is wrong");
        start();
      }, 2000);            
   };

   Sitecore.PageModes.ChromeManager.chromeUpdated.observe(callback);   
   placeholder.type.addControl(position, {controlId: Sitecore.UnitTests.Constants.sampleSublayoutId});
   stop(3000);
});

test("Move rendering", function() {
  var placeholders = Sitecore.PageModes.ChromeManager.getChromesByType(Sitecore.PageModes.ChromeTypes.Placeholder);
  var placeholderWithMultipleRenderings = $sc.first(placeholders, function() { return this.type.renderings().length > 1; }); 
  if (!Sitecore.UnitTests.Helper.requiredCondition(placeholderWithMultipleRenderings, "There's no placeholder with more than 1 rendering")) {
    return;
  }

  expect(3);
  var firstRenderingUid = placeholderWithMultipleRenderings.type.renderings()[0].type.uniqueId();  
  var secondRendering =  placeholderWithMultipleRenderings.type.renderings()[1];
  var secondRenderingUid = secondRendering.type.uniqueId();
  Sitecore.PageModes.DesignManager.moveControlTo(secondRendering, placeholderWithMultipleRenderings, 0);
  stop(1000);
  setTimeout(function() {
    var renderings = placeholderWithMultipleRenderings.type.renderings();
    same(renderings[0].type.uniqueId(), secondRenderingUid, "Not equal");
    same(renderings[1].type.uniqueId(), firstRenderingUid, "Not equal");
    start();
  }, 500); 
});